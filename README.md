**Version Installed:** OCP 4.1 released!

## Introduction: Purpose of these playbooks

The OCP 4.1 installer supports two deployments scenarios: IPI and UPI. **I**nstaller‑**P**rovisioned **I**nfrastructure (IPI) is only supported on AWS for now. Because we deploy on vSphere, we use the **U**ser-**P**rovisioned **I**nfrastructure (UPI) scenario which means we need to provision... the infrastructure (surprise!).

They are currently two top-level playbooks that you can use, `site.yml` and `playbooks/ldap.yml`

The `site.yml` playbook does the following:

1. runs the OpenShift Installer to generate the ignition data required by the OpenShift virtual machines
2. provisions the virtual machines listed in the Ansible inventory and powers up the non-OCP virtual machines
3. configures the services running on the non-OCP virtual machines including DNS and DHCP services.
4. configures anti affinity DRS rules for the virtual machines (master VMs should run on separate hosts as well as the infrastructure (DNS and DHCP services) and load balancer VMs (for now only one LB supported)
5. powers up the OCP virtual machines
6. waits for the OpenShift API to come up on the master nodes
7. creates a PV from an NFS share and a PVC for use by the OpenShift Registry
8. configures the OpenShift Registry
9. waits for all Cluster Operators to be available
10. runs the final step of the OpenShift Installation (wait-for installation-complete)



The playbook `playbooks/ldap.yml` illustrates how to integrate an LDAP service into the cluster as an identity provider. The default custom resource provided (as a file) was tested against a Microsoft Active Directory. You will probably have to adapt this file to match your environment

## Requirements

| Requirement (1)                                              | Choice Made                                               | Comment                                                      |
| :------------------------------------------------------------ | :--------------------------------------------------------- | :------------------------------------------------------------ |
| vCenter Infra 6.7U1                                          |                                                           | You need admin credentials                                   |
| ESXi cluster of three machines                               |                                                           | If you want HA you need three machines in the cluster and you need to deploy 3 masters |
| One proxy-free VLAN with access to Internet (to pull Red Hat artifacts) | a portgroup connected to all machines in your ESX cluster | The playbooks install DHCP services on this VLAN so no other DHCP service should be running on this VLAN |
| One routed subnet for use on the above VLAN                  |                                                           | from your net admin.                                         |
| One Access Network / VLAN plus the following number of IP addresses:  1+ n, where n is the number of load balancers | another portgroup                                         | from your net admin                                          |
| DNS and NTP services                                         |                                                           |                                                              |

The playbooks creates OCP VMs according to the following sizing:

| VM                                           | OS and Sizing                            | Comments                                     |
| :------------------------------------------- | :---------------------------------------- | :-------------------------------------------- |
| 1 x bootstrap machine                        | CoreOS 4xCPU, 16GB RAM, 120GB disk space | This is the RH minimum requirement           |
| 3 x master machines                          | CoreOS 4xCPU, 16GB RAM, 120GB disk space | This is the RH minimum requirement           |
| n x worker machines (depending on inventory) | CoreOS 2xCPU, 16GB RAM, 120GB disk space | This is two times the RH minimum requirement |

The playbooks also creates the following VMs which provide additional infrastructure services required by OCP

| VM                | OS and Sizing | Comments                                                     |
| :----------------- | :------------- | :------------------------------------------------------------ |
| 1 x load balancer | Red Hat 7.6   | Only one LB allowed with this version of the playbooks       |
| 1 or 2 x Infra    | Red Hat 7.6   | One or two VMs providing DHCP and DNS services on the internal VLAN. Configure two for HA purposes |
| 1 x NFS           | Red Hat 7.6   | one NFS VM to hold the OpenShift Registry images             |

## Prepare an Ansible box

- I use Fedora 29 and Ansible 2.8 (**REQUIRED**) (dnf update probably necessary)
- My Ansible box is directly connected to the proxy-free VLAN (I don’t know if this is important or not, I don't think so)
- the playbooks work from a non privileged account. It will make your life easier if you work from an account named **core** because: 
  - RH CoreOS builtin account is '**core'**
  - a user with the same name as the user who runs the playbooks on the Ansible box is created on non CoreOS VMs
  - Populate the variable **group_vars/vars/vault.yml:vault.ssh_key** with the default public key of the user who will run the playbooks (~/.ssh/id_rsa.pub)
- Make sure the user who runs the playbooks can sudo without a password on the Ansible box
  - to be completed (see Linux doc, sudo)

## **Prepare a RHEL template**

The load balancer(s) and the infrastructure nodes are cloned from a RHEL7 template. You need to create this template. Use the following specs:

- 2 vCPUs
- 4GB of ram
- one disk, prefer thin provisioning. 50G is enough
- guest OS family Linux/RHEL 7 64-bits
- configure CD/DVD to connect to the RHEL7 ISO image at power on
- take note of the name you give to the VM. (eg hpe-rhel760). You will document this name with the Ansible variable `group_vars/all/vars.yml:rhel_template:`

Power on the template and connect to the VM's console

- select the language
- installation destination: automatically configure partitioning
- config network and hostname:  assign an IP address or use DHCP depending on your environment
- config time (prefer Etc/Coordinated Universal Time), configure ntp 
- software selection : base environment: Infrastructure Server, Add-ons for Selected Environment: Guest Agents
- start the installation

While the installation runs configure a password for the root account. You don't need to create a user account.

Once the installation is finished, log in the VM (root account) and perform the following tasks:

- change the hostname of the template giving it a name that you will recognize in your Red Hat Account (for example) :

  `nmcli general hostname=hpe-rhel760`

- register the system with the Red Hat portal and attach it to a subscription. You can do this using the following command if you have created activations keys. 

  `subscription-manager register --org=<your_org> --activationkey=<activation key>`

- update the machine

  `yum update -y`

- install the cloud-init package that takes the VMware guestinfo interface as a data source

  `yum install -y https://github.com/vmware/cloud-init-vmware-guestinfo/releases/download/v1.1.0/cloud-init-vmware-guestinfo-1.1.0-1.el7.noarch.rpm`

- clear the bash history

  `history -c`

- shutdown the machine

  `shutdown -h now`

**Note:** The playbooks have been tested with CentOS 7.6 as well. If you use CentOS you don't have to run the subscription-manager command above.

Finally, make sure the name of this template matches the variable `group_vars/all/vars.yml:infra_template`.

## **Prepare an OVA file (optional)**

It is possible to deploy the `infra_template` from an OVA. To create the OVA proceed as indicated below:

- **make sure** the one network interface of the template is connected to the network named 'VM Network'
- set the CD/DVD for the template to client device (vs an ISO image in a Datastore)
- Select the template and export it as an OVF template
- Create a tar archive of **all** the files that where downloaded. The extension MUST be .ova (and not .tar)
- Copy the OVA file to a location that the Ansible user can access and use the ansible_variable `group_vars/all/vars.yml:infra_ova_path:` to tell the playbooks where you stored the OVA file.

note: If a template with the name specified by `group_vars/all/vars.yml:infra_template` is found in the vCenter Datacenter, the OVA file will not be deployed and the existing template will be used to deploy non-CoreOS VMS. If the template is not found, the OVA file is deployed and the template is given the name documented by `infra_template`.

## **Download Required Files**

You need to copy a number of files to the Ansible box. We need the Linux installer, the Linux client and the Red Hat CoreOS OVA. The exact file names reflect the version of the release. At the time of writing, the latest version available for the OpenShift installer and the client tools was 4.1.4, and 4.1.0 for the Red Hat CoreOS VMware template. The ultimate reference for downloading required files is [here](https://cloud.redhat.com/openshift/install/vsphere/user-provisioned).

```
mkdir /kits
cd /kits
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux-4.1.4.tar.gz
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-install-linux-4.1.4.tar.gz
wget https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.1/latest/rhcos-4.1.0-x86_64-vmware.ova
tar -xvf openshift-client-linux-4.1.4.tar.gz
tar -xvf openshift-install-linux-4.1.4.tar.gz
```

Download your pull secret from this page: <https://cloud.redhat.com/openshift/install/vsphere/user-provisioned>.  You will use your pull secret to set a value to the variable `group_vars/all/vault.yml:vault.pull_secret`

If the account you use on the Ansible box does not have a default SSH keypair, create one (using ssh-keygen). If you configure a passphrase on the private key, make sure the key is added to your SSH agent. The content of the file ~/.ssh/id_rsa.pub should be used to configure the key `group_vars/all/vault.yml:vault.ssh_key`

More info on variables later.

## **Clone the repo**

From the Ansible box (user core)

```
git clone https://github.com/HewlettPackard/OpenShift-on-SimpliVity.git
```

## **Prepare to run the playbooks**

### Configure the playbooks

- Copy `group_vars/all/vars.yml.sample` to `group_vars/all/vars.yml`
- Edit `group_vars/all/vars.yml` to match your environment. More details can be found [here](#vars_yml)
- Copy `group_vars/all/vault.yml.sample` to `group_vars/all/vault.yml`
- Edit `group_vars/all/vault.yml` to match your environment. More details can be found [here](#vault-yml) 

**Note**: you don’t need to edit the group files (such as `group_vars/master.yml`) unless you want the sizing of the VMs.

### Create your inventory

Make a copy of the file `hosts.sample` to  - say - `hosts`. This will be your inventory. Modify `hosts` to match your environment:

- use unique names in the vCenter environment, recommended VM names in the form xxx-master0, xxx-lb1 etc, where xxx is the name of your cluster.

  **note:** underscores (_) are not valid characters in hostnames

- use your own IP addresses and not those coming from the sample file

- Configure one or two machines in the `[infrastructure]` group. Configure two VMs if you want HA. Configure only one if you don't need HA.

- Only configure one machine in the `[loadbalancer]` group. Future rev will implement 2 load balancers and virtual IPs.

- Load balancers need to have two IP addresses. One on the internal network designated by  `group_vars/all/vars.yml:vm_portgroup` and specified with the `ansible_host` variable. A second address for the frontend network designated by the variable `frontend_ipaddr` in the inventory. `frontend_ipaddr` should be specified in CIDR notation (for example 10.10.174.165/22).



### About Persistent Storage

By default the OpenShift installer configures a default storage class which uses the vSphere Cloud Provider. This provider does not support the [ReadWriteMany](https://docs.openshift.com/container-platform/4.1/installing/installing_vsphere/installing-vsphere.html#installation-registry-storage-config_installing-vsphere) access mode which is required by the Image Registry. For this reason, the `site.yml` playbook deploys an NFS virtual machine which exports a number of NFS shares. The Image Registry service will use one of these. The number of shares that the playbooks creates can be customized using the variable `group_vars/all/vars.yml/num_nfs_shares`. Only one share is required by the Image Registry service. Use vSphere volumes in your apps if you don't need ReadWriteMany access mode

## run the playbook site.yml

**WARNING**: Make sure you run the `site.yml` playbook from the top-level directory of the git repository. The repository comes with an `ansible.cfg` file and a number of options which are required.

Provided you clones the repository under `~/OpenShift-on-SimpliVity`, perform the following commands on your Ansible machine:

```
cd ~/OpenShift-on-SimpliVity
ansible-playbook –i hosts site.yml
```

Depending on your hardware and the load, it takes approximately 30mns for the playbook to finish successfully. 

## Monitoring the progresses

The playbooks that powers on the OCP machines monitors port 22 for the non OCP VMs and port 22623 to assess the successful “ignition” of the OpenShift cluster.

You can monitor the progress of the ignition process in several places:

- After powering on the OCP VMs, the playbook repeatedly polls specific ports on the OCP machines and displays a line per retry for each machine being polled so that you know that it is not stuck.  To be specific, the playbook first polls ports 22 on all OCP machines, then when all OCP machines have their port 22 up and running, it polls ports 22 and 22623 depending on the machine role.

  **Note:** In my environment, the playbook finishes at 70 / 60 retries remaining.

- You should see the `openshift-api-server` and the `machine-config-server` endpoints available on the bootstrap machine. Use the Load Balancer stats screen to check this out (url [http://your‑lb-ip-address:9000](http://yourlb-ip-address:9000/))
  
- SSH to the bootstrap VM and run the following command:

  `journalctl -b -f -u bootkube.service`

  When something is wrong, the bootstrap VM waits endlessly for the etcd cluster to come online. The documentation gives a few hints on how to troubleshoot ignition.

- Several minutes after all the VMS have been powered on (you don’t have anything to do), the `bootkube.service` service completes successfully. You can view this using the same `journalctl` command as in the previous step from the bootstrap VM.
- It may take a while before all the endpoints are up in the Load Balancer Stats screen. The `site.yml` playbook finishes when all these endpoints are successfully polled. Note that the `openshift-api-server` and `machine-config-server` endpoints for the bootstrap machine are down. This is expected,
- typical elapsed time for the `site.yml` playbook to finish is 30mns.

## Persistent Storage

The OpenShift Image Registry is configured to use a kubernetes Persistent Volume backed by an NFS Share to store the images. Everything is configured by the playbooks.

A default Storage Class is also configured that leverages the vSphere Cloud Provider (VCP). It supports dynamic volume provisioning.

**Note**: the reason why the Registry does not use a vSphere volume is that because VCP does not support the ReadWriteMany access mode .

 

# Finish the installation

The installation of the control plane is finished. You are ready to start the customization of your deployment as explained here:  https://docs.openshift.com/container-platform/4.1/installing/install_config/customizations.html#customizations

Note The kubeconfig and kubeadmin-password files are located in the auth folder under your `install_dir` directory (specified in `group_vars/all/vars.yml`). The kubeconfig file is used to set environment variables needed to access the OCP cluster via the command-line.  The kubeadmin-password file contains the password for the "kubeadmin" user, which may be useful for logging into the OCP cluster via the web console.  

## LDAP Integration

This repository comes with a playbook that will help you configure your LDAP services as an identity provider for the cluster you deployed with `site.yml`. The playbook was tested with a Microsoft Active Directory service.

This section assumes that you have some basic knowledge of LDAP. If you don't, you will probably need to read some literature on the subject. As a minimum, you will need to understand what RFC 2255 URLs are and how to build them to query your LDAP environment.

### Requirements

Before you attempt to integrate with your LDAP you need to understand the following:

- Which users in the LDAP tree you want to be able to login in the OpenShift cluster
- How to you "filter" these users
- A user (with credentials) in the LDAP tree that you will use to "bind" with the LDAP service (the playbook implements simple binding and so does the Openshift Identity Provider)
- If using secure ldap (`ldaps`) - which is highly recommended - you will need the certificate of the CA which signed the certificate or your LDAP server

### Preparation Steps

Here is what you should do before running the playbook:

1.  edit the file `group_vars/all/vars.yml` and specify the Distinguished Name of the LDAP user you want to use to bind with the LDAP service. For this purpose configure the variable `ldap_bind_user_dn:` The password of this account is specified with the variable `ldap_bind_user_password` using an indirection (to follow the best practice). The actual value of this password is stored in the file `group_vars/all/vault.yml` which you should encrypt with `ansible-vault`. In the **example** below, the user `adreader` (which must exists) will be used to bind with the LDAP service. Make sure you leave the variable `ldap_bind_user_password` unchanged.

   `ldap_bind_user_dn: "cn=adreader,cn=Users,dc=am2,dc=cloudra,dc=local"`

   `ldap_bind_user_password: "{{ vault.ldap_bind_user_password }}"`

   **Note**: The playbook will create a secret to store the password for the binding user.

2. edit the vault file located in `group_vars/all/vault.yml` (preferably  using `ansible-vault` because you want this file to be encrypted) and configure the variable `vault.ldap_bind_user_password:`  This is the password for the LDAP user you use for binding with the LDAP service. 

   `vault:`
     `ldap_bind_user_password: 'YourpasswordHere'`

3. The playbook supports LDAPS which means you need to configure the identity provider with the certificate of the Root CA which signed the LDAP service certificate. How you can retrieve this Root CA certificate will depend on your environment. In any case, you need to deposit this certificate under the name `ca.pem` in `playbooks/roles/ldap/files`.

   **Note**: the playbook will create a ConfigMap to store this certificate.

4. Edit the file named `ldap_cr.yml` under `playbooks/roles/ldap/vars`. The OpenShift 4.1 documentation explains how to populate this file [here](https://docs.openshift.com/container-platform/4.1/authentication/identity_providers/configuring-ldap-identity-provider.html) .  Because the content of this file is highly customizable we did not try to parameterize it. As a minimum you will want to modify the url specified in the default file. This URL and how it is built is described in [RFC 2255](https://tools.ietf.org/html/rfc2255). 

**Note:** Before you attempt to run `playbooks/ldap.yml` it is highly recommended you test your settings with a tool like `ldapsearch` (for example). If you cannot query your LDAP with the user (and creds) and CA certificate your configured earlier then  the Identity provider that the playbook configures will fail to interact with your LDAP service. An example of query is shown below where we bind with the user `adreader` to query a user called `john`.

`ldapsearch  -H ldaps://mars-adds.am2.cloudra.local -\`
                  `x -w '(redacted)' -D "cn=adreader,cn=Users,dc=am2,dc=cloudra,dc=local" \`
                 `-b "cn=Users,dc=am2,dc=cloudra,dc=local"  \`
                 `"(&(objectClass=person)(sAMAccountName=john))"`

The query above is similar to the query that the Identity provider will run against the LDAP service whenever someone wanted to log in as `john` and the following URL is specified in `ldap_cr.yml`.

`ldaps://mars-adds.am2.cloudra.local/CN=Users,DC=am2,DC=cloudra,DC=local?sAMAccountName??(objectClass=person)`

You may want to use `ldapsearch` using insecure connections first (if your LDAP server allows these type of connections) then configure `ldapsearch` with the CA certificate that signed the certificate of your LDAP server and use `ldaps` connections. It is highly recommended to use secure LDAP connections (`ldaps`) in a production environment.

### Running the playbook

Once you are ready with the preparation steps above, you can run the ldap.yml playbook

`cd <folder of repo>`
`ansible-playbook -i hosts playbooks/ldap.yml`

### Verification

After the playbook is finished running, try to login using the new Identity provider. You can do it using the CLI or the console. A sample session is shown below

**Note**: You may have to wait a few seconds before the `authentication` cluster operator is available. 

`[core@hpe-ansible pictures]$ oc login -u ocpuser1`
`Authentication required for https://api.hpe.hpecloud.org:6443 (openshift)`
`Username: ocpuser1`
`Password:`
`Login successful.`

`You don't have any projects. You can try to create a new project, by running`

    oc new-project <projectname>

`[core@hpe-ansible pictures]$ oc whoami`
`ocpuser1`
`[core@hpe-ansible pictures]$`



# Appendix: variable files

## <a id="vars_yml"></a>group_vars/all/vars.yml

The file group_vars/all/vars.sample contains the list of ansible variables that you should configure to match your environment.  This file comes with plenty of comments 

https://github.com/HewlettPackard/OpenShift-on-SimpliVity/blob/master/group_vars/all/vars.yml.sample



## <a id="vault-yml"></a>group_vars/all/vault.yml

all keys here are properties of the dictionary called **vault.**

| key                 | example value          | comment                                                      |
| :------------------ | :--------------------- | :----------------------------------------------------------- |
| vcenter_password    | 'yourpassword'         | this is the password for the vCenter admin user specified with vcenter_username in group_vars/all/vars.yml |
| simplivity_password | 'yourpassword'         | typically the same as above                                  |
| rhn_org_id          | 'not used for now'     |                                                              |
| rhn_key             | 'not used for now'     |                                                              |
| rhn_user            | 'not used for now'     |                                                              |
| rhn_pass            | 'not used for now'     |                                                              |
| pull_secret         | 'yourpullsecrethere'   | see the about [pull secret and ssh key](https://confluence.simplivt.local/display/PE/Installing+OCP+4.1+released+version#InstallingOCP4.1releasedversion-pullsecret) |
| ssh_key             | 'yourSSHpublickeyhere' | see the about [pull secret and ssh key](https://confluence.simplivt.local/display/PE/Installing+OCP+4.1+released+version#InstallingOCP4.1releasedversion-pullsecret) |


# **Appendix: Inventory**

The file https://github.com/HewlettPackard/OpenShift-on-SimpliVity/blob/master/hosts.sample contains an example inventory. The IP used in this inventory are inline with the settings documented in the group_vars/all/vars.yml.sample (dhcp_subnet and gateway)

# **Appendix: Environment**

The environment consists of a 4-node SimpliVity cluster running the latest OmniStack bits at the time of testing

- Hardware Model: HPE SimpliVity 380 Series 6000
- OmniStack 3.7.8.232 (PSI16)
- ESXi 6.7 EP 05 10764712
- vCenter 6.7U1b (build 11726888)

# 