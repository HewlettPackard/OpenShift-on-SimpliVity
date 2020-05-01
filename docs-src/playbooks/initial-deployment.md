# Initial cluster deployment using `site.yml`


Once you have configured all of the variables and vault parameters to match your environment, run the 
playbook `site.yml` to perform the initial cluster deployment:

```
$ cd ~/OpenShift-on-SimpliVity
$ ansible-playbook -i hosts site.yml --vault-password-file .vault_pass
```

`site.yml` is a wrapper for a number of playblooks that perform different functions: 

```
playbooks/prepare.yml
playbooks/provision.yml
playbooks/configure.yml
playbooks/poweron.yml
playbooks/finish.yml
playbooks/hpe_cluster_verification.yml
```

## Prepare

The preparation stage includes the following tasks:

- Install client tools
- Create support and cluster folders in vCenter to house the VMs
- Populate `/etc/hosts` file on the Ansible controller node
- Configure and start an HTTP server on Ansible controller node
- Set up custom firewall rules

## Provision

The provision stage includes the following tasks:

- Prepare OCP Ignition data files
- Provision the bootstrap, master and CoreOS worker nodes
- Provision and power on supporting nodes, including DNS/DHCP, load balancers and NFS


## Configure

The configuration phase consists of:

- Configuring anti-affinity DRS rules
- Configuring supporting nodes including DNS/DHCP, load balancer and NFS nodes. 
- Configure VM disks and RedHat subscription.


## Power on

This stage powers on any nodes that have not already been started. It waits for the OpenShift API server port on the master nodes to be ready and checks that access to port 22 is available on other nodes.

## Finish

A number of tasks are performed after powering on the nodes to ensure that the cluster has been successfully deployed:

- Wait until the OpenShift installer reports that bootstrap is complete
- Approve any pending Certificate Signing Requests (CSR)
- Wait for the image registry to be ready and configure persistent volumes for the NFS server
- Verify that all the cluster operators are available
- Wait for the OCP cluster to report installation is complete


## Verification

A cluster verification program is run as the last stage of the `site.yml` deployment playbook. This program
installs a sample Wordpress / MySql application, validates that it is working as expected and then tears down the
application so that there are no artefacts left behind in your cluster.

