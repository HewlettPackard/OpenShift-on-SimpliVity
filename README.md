**Version Installed:** OCP 4.1 released!

## Introduction: Purpose of these playbooks

The OCP 4.1 installer supports two deployments scenarios: IPI and UPI. **I**nstaller‑**P**rovisioned **I**nfrastructure (IPI) is only supported on AWS for now. Because we deploy on vSphere, we use the **U**ser-**P**rovisioned **I**nfrastructure (UPI) scenario which means we need to provision... the infrastructure (surprise!).

The **site.yml** playbook does the following:

1. runs the Openshift Installer to generate the ignition data required by the OpenShift virtual machines
2. provisions the virtual machines listed in the Ansible inventory and powers up the non-OCP virtual machines
3. configures the services running on the non-OCP virtual machines including DNS and DHCP services.
4. powers up the OCP virtual machines
5. wait for the Openshift API to come up on the master nodes



| Requirement (1)                                              | Choice Made                                               | Comment                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| vCenter Infra 6.7U1                                          |                                                           | You need admin credentials                                   |
| ESXi cluster of three machines                               |                                                           | If you want HA you need three machines in the cluster and you need to deploy 3 masters |
| One proxy-free VLAN with access to Internet (to pull Red Hat artifacts) | a portgroup connected to all machines in your ESX cluster | The playbooks install DHCP services on this VLAN so no other DHCP service should be running on this VLAN |
| One routed subnet for use on the above VLAN                  |                                                           | from your net admin.                                         |
| One Access Network / VLAN plus the following number of IP addresses:  1+ n, where n is the number of load balancers | another portgroup                                         | from your net admin                                          |
| DNS and NTP services                                         |                                                           |                                                              |

The playbooks creates OCP VMs according to the following sizing:

| VM                                           | OS and Sizing                            | Comments                                     |
| -------------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| 1 x bootstrap machine                        | CoreOS 4xCPU, 16GN RAM, 120GB disk space | This is the RH minimum requirement           |
| 3 x master machines                          | CoreOS 4xCPU, 16GN RAM, 120GB disk space | This is the RH minimum requirement           |
| N x worker machines (depending on inventory) | CoreOS 2xCPU, 16GN RAM, 120GB disk space | This is two times the RH minimum requirement |



The playbooks also creates the following VM which provides additional infrastructure services required by OCP

| VM                | OS and Sizing | Comments                                                |
| ----------------- | ------------- | ------------------------------------------------------- |
| 1 x load balancer | Red Hat 7.6   | Only one LB allowed with this version of the playbooks  |
| 1 x Infra         | Red Hat 7.6   | VM providing DHCP and DNS services on the internal VLAN |



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
- take note of the name you give to the VM. (eg *hpe-rhel760*). You will document this name with the Ansible variable **group_vars/all/vars.yml:rhel_template:**

Power on the template and connect to the VM's console

- select the language
- installation destination: automatically configure partitioning
- config network and hostname:  assign an IP address or use DHCP depending on your environment
- config time (prefer Etc/Coordinated Universal Time), configure ntp 
- software selection : base environment: Infrastructure Server, Add-ons for Selected Environment: Guest Agents
- start the installation

While the installation runs configure a password for the root account. You don't need to create a user account.

Once the installation is finished, log in the VM (root account) and perform the following tasks:

- change the hostname of the template giving it a name that you will recognize in your Red Hat Account :

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

Finally, make sure the name of this template match the variable group_vars/all/vars.yml:infra_template.

## **Prepare an OVA file (optional)**

It is possible to deploy the infra_template from an OVA. To create the OVA proceed as indicated below:

- **make sure** the one network interface of the template is connected to the network named 'VM Network'
- set the CD/DVD for the template to client device (vs ISO in Datastore)
- Select the template and export it as an OVF template
- Create a tar archive of **all** the files that where downloaded. The extension MUST be .ova (and not .tar)
- Copy the OVA file to a location that the Ansible user can access and use the ansible_variable **group_vars/all/vars.yml:infra_ova_path:** to tell the playbooks where you stored the OVA file.

**note:** If a template with the name specified by **group_vars/all/vars.yml:infra_template** is found in the vCenter Datacenter, the OVA file will not be deployed and the existing template will be used to deploy non-CoreOS VMS. If the template is not found, the OVA file is deployed and the template is given the name documented by **infra_template**.

## **Download Required Files**

You need to copy a number of files to the Ansible box. We need the Linux installer, the Linux client and the rhcos OVA. Note that these are the released versions of OCP 4.1.

```
mkdir /kits
cd /kits
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux-4.1.0.tar.gz
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-install-linux-4.1.0.tar.gz
wget https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.1/latest/rhcos-4.1.0-x86_64-vmware.ova
tar -xvf openshift-client-linux-4.1.0.tar.gz
tar -xvf openshift-install-linux-4.1.0.tar.gz
```

Download your pull secret from this page: <https://cloud.redhat.com/openshift/install/vsphere/user-provisioned>.  You will use your pull secret to set a value to the variable **group_vars/all/vault.yml:vault.pull_secret**

If the account you use on the Ansible box does not have a default SSH keypair, create one (using ssh-keygen). If you configure a passphrase on the private key, make sure the key is added to your SSH agent. The content of the file ~/.ssh/id_rsa.pub should be used to configure the key **group_vars/all/vault.yml:vault.ssh_key**

More info on variables later.

## **Clone the repo**

From the Ansible box (user core)

```
git clone https://github.com/chris7444/ocpsvt.git
```

## **Prepare to run the playbooks**

### Configure the playbooks

- Copy group_vars/all/vars.yml.sample to group_vars/all/vars.yml
- Edit vars.yml to match your environment. More details can be found [here](#vars_yml)
- Copy group_vars/all/vault.yml.sample to group_vars/all/vault.yml
- Edit vault.yml to match your environment. More details can be found [here](#vault-yml) 

**Note**: you don’t need to edit the group files

### Create your inventory

Make a copy of hosts.sample (name the copy **hosts**) and make the modification needed to match your environment:

- use unique names in the vCenter environment, recommended VM names in the form xxx-master0, xxx-lb1 etc, where xxx is the name of your cluster.

  **note:** underscores (_) are not valid characters in hostnames

- use your own IP addresses and not those coming from the sample file

- verify that the IP addresses you allocate to the OCP VMs are inside the **dhcp_scope** you define in **group_vars/all/vars.yml**

- Only configure one machine in the infrastructure group. If you configure two machines, you will end up having two DHCP servers on your VLAN (future rev will implement ISC DHCP failover)

- Only configure one machine in the loadbalancer group. Future rev will implement 2 LBs and virtual IPs (similar to what we have done for Docker EE)

- Load balancers need to have two IP addresses. One on the internal network designated by **vm_portgroup** in group_vars/all/vars.yml and specified with the ansible_host variable. A second address for the frontend network designated by **frontend_ipaddr** in the inventory. frontend_ipaddr should be specified in CIDR notation (for example 10.10.174.165/22).



## run the playbooks

Perform the following commands on your Ansible machine

```
cd ~/ocpsvt
ansible-playbook –i hosts site.yml
```

Depending on your hardware and the load, it takes approximately 20mns for the playbook to finish successfully.

## Monitoring the progresses

The playbooks that powers on the OCP machines monitors port 22 for the non OCP VMs and port 22623 to assess the successful “ignition” of the OpenShift cluster.

You can monitor the progress of the ignition process in several places:

- After powering on the OCP VMs, the playbook repeatedly polls specific ports on the OCP machines and displays a line per retry for each machine being polled so that you know that it is not stuck.  To be specific, the playbook first polls ports 22 on all OCP machines, then when all OCP machines have their port 22 up and running, it polls ports 22 and 22623 depending on the machine role.

  **Note:** In my environment, the playbook finishes at 70 / 60 retries remaining.

- You should see the openshift-api-server and the machine-config-server endpoints available on the bootstrap machine. Use the Load Balancer stats screen to check this out (url [http://your‑lb-ip-address:9000](http://yourlb-ip-address:9000/))
  
- SSH to the bootstrap VM and run the following command:

  `journalctl -b -f -u bootkube.service`

  When something is wrong, the bootstrap VM waits endlessly for the etcd cluster to come online. The documentation gives a few hints on how to troubleshoot ignition.

- Several minutes after all the VMS have been powered on (you don’t have anything to do), the bootkube.service service completes successfully. You can view this using the same journalctl command as in the previous step from the bootstrap VM.
- It may take a while before all the endpoints are up in the Load Balancer Stats screen. The site.yml playbook finishes when all these endpoints are successfully polled. Note that the openshift-api-server and machine-config-server endpoints for the bootstrap machine are down. This is expected,
- typical ellapsed time for the sites.yml playbook to finish is between 16mn and 20mns.



# Finish the installation

The installation is NOT finished. You need to continue with the steps described here:  <https://docs.openshift.com/container-platform/4.1/installing/installing_vsphere/installing-vsphere.html#cli-logging-in-kubeadmin_installing-vsphere> paragraph **Logging into the cluster**.

Note that the kubeconfig and kubeadmin-password files are located in the **auth** folder under your **install_dir** directory (key is specified in group_vars/all/vars.yml). The kubeconfig file is used to set environment variables needed to access the OCP cluster via the command-line.  The kubeadmin-password file contains the password for the "kubeadmin" user, which may be useful for logging into the OCP cluster via the web console.  The playbook does not install the oc utility (yet).



# Appendix: variable files

## <a id="vars_yml"></a>group_vars/vars.yml


| key                    | example value                         | comments                                                     |
| :--------------------- | :------------------------------------ | :----------------------------------------------------------- |
| install_dir            | "{{ playbook_dir }}/../../.ocp"       | this is where the ignition files and the kubeconfig file will be stored. If you cloned the repo in ~/ocpsvt, the default value will create a folder ~/.ocp. The kubeconfig file is located in {{ install_dir }}/auth |
| ocp_installer_path     | /kits/openshift-install               | The Openshift Installer is expected to be at this location   |
| pull_secret            | '{{ vault.pull_secret }}'             | Indirection to the pull secret stored in group_vars/all/vault.yml. Use the example value as it is. |
| vm_portgroup           | hpeOpenshift                          | portgroup that the VMs connect to. Must be a proxy free VLAN with an access to the internet |
| dhcp_scope             | '10.15.152.201 10.15.152.254'         | 'startaddr endaddr' scope that DHCP will manage. Of course this must be inside the **dhcp_subnet** (See below) |
| dhcp_subnet            | 10.15.152.0/24                        | subnet to use on the VLAN/network connected to the **vm_portgroup**. CIDR notation |
| gateway                | 10.15.152.1                           | gateway for the **dhcp_subnet** subnet.                      |
| domain_name            | hpecloud.org                          | base DNS domain name used for the cluster |
| vcenter_hostname       | vcentergen10.em2.cloudra.local        | Name of your vCenter server. Must be resolvable by the Ansible box |
| vcenter_username:      | Administrator@vsphere.local           | Admin account in your vCenter infrastructure. The password is specified in group_vars/all/vault.yml (encrypted or not) |
| vcenter_password       | '{{ vault.vcenter_password }}'        | indirection to password in vault file, don't change it       |
| vcenter_validate_certs | false                                 |                                                              |
| vcenter_cluster        | Docker                                | the name of your SimpliVity cluster                          |
| datacenter             | DEVOPS                                | datacenter where all the vCenter artifact can be found (including the vcenter_cluster, the templates etc) |
| datastores             | ['Openshift_HPE']                     | Name of the Datastore which will receive all the VMs. Must exist (for now) |
| infra_folder           | hpeInfra                              | folder where the non-OCP VMs and templates will be deployed. This folder is created if it does not exist |
| master_ova_path        | "/kits/rhcos-4.1.0-x86_64-vmware.ova" | Path to RHCOS OVA (name and location of the file Red Hat CoreOS OVA you downloaded from Red Hat) |
| worker_ova_path        | "{{ master_ova_path }}"               | Path to the OVA file used to create the VM template for OCP worker nodes. The proposed value configures the same ova as master nodes. |
| infra_ova_path         | "/kits/hpe-rhel760.ova"               | Path to the OVA file used to create the VM template for infra machines (LBs etc) |
| master_template        | hpe-rhcos                             | VMware template name for OCP master nodes.You don't need to create this template, the playbook will do it for you |
| worker_template        | "{{ master_template }}"               | VMware template name for OCP worker nodes (same as master nodes by default, ie RH CoreOS) |
| infra_template         | hpe-rhel760                           | VMware template name for non OCP Vms (such as LBs etc)       |
| ssh_key                | '{{ vault.ssh_key }}'                 | indirection to SSH public key stored in group_vars/all/vault.yml (note: it is a public key, there is no reason to store it in vault, will change this in the next revision of the playbooks) |
| frontend_vm_portgroup  | 'VM Network'                          | Name of the portgroup connected to the access/public network |
| frontend_gateway       | '10.10.172.1'                         | Access network gateway                                       |



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



# **Appendix: Environment**

The environment consists of a 4-node SimpliVity cluster running the latest OmniStack bits at the time of testing

- Hardware Model: HPE SimpliVity 380 Series 6000
- OmniStack 3.7.8.232 (PSI16)
- ESXi 6.7 EP 05 10764712
- vCenter 6.7U1b (build 11726888)



# **Appendix: Sample IP allocation scheme (used in the sample files)**



| IP or key     | value                       | Comment                                                      |
| ------------- | --------------------------- | ------------------------------------------------------------ |
| dhcp_subnet   | 10.15.152.0/24              | Subnet on the  proxy free VLAN.  Assigned by the network admins |
| dhcp_scope    | 10.15.152.201 10.15.152.254 | The DHCP service manages the IP addresses in this scope. The IP addresses you allocate to the OCP VMs (VMS in groups master, bootstrap and worker must be in this range.. defined by you but must be in **dhcp_subnet**. |
| gateway       | 10.15.152.1                 | Gateway for **dhcp_subnet**.                                 |
| hpe-ansible   | 10.15.152.4                 | This is the Ansible box. Also hosting the bootstrap.ign file |
| hpe-infra1    | 10.15.152.5                 | Machine hosting DNS and DHCP. Note that the IP address is inside **dhcp_subnet** but outside **dhcp_scope**. |
| hpe-lb1       | 10.15.152.7                 | Ioad balancer. Also (for now) api and api-int IP addresses. Note that this is outside the **dhcp_scope** but inside **dhcp_subnet**.. |
| hpe-bootstrap | 10.15.152.209               | OCP Bootstrap machine. Note that this IP address is inside the **dhcp_scope**. (a reservation will be made by the playbooks) |
| hpe-master0   | 10.15.152.210               | OCP master machine. Note that this IP address is inside the **dhcp_scope**. (a reservation will be made by the playbooks) |
| hpe-master1   | 10.15.152.211               | OCP master machine. Note that this IP address is inside the **dhcp_scope**. (a reservation will be made by the playbooks) |
| hpe-master2   | 10.15.152.212               | OCP master machine. Note that this IP address is inside the **dhcp_scope**. (a reservation will be made by the playbooks) |
| hpe-worker0   | 10.15.152.213               | OCP worker machine. Note that this IP address is inside the **dhcp_scope**. (a reservation will be made by the playbooks) |
| hpe-worker1   | 10.15.152.214               | OCP worker machine. Note that this IP address is inside the **dhcp_scope**. (a reservation will be made by the playbooks) |


