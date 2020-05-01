# Create the Red Hat Linux template

To create the Red Hat Linux VM template that will be used as the base image for all non-RHCOS VM nodes, 
you first create a Virtual Machine, install the base RHEL 7.6 OS and then convert the VM to a VM Template.
Any additional software installations and/or system configuration is performed subsequently using Ansible, 
rather than in the template itself.

As the creation of the template is a one-time task, this procedure has not been automated. The steps required to manually create a VM template are outlined below.

Log in to vCenter and create a new Virtual Machine with the following characteristics:

-   **Guest OS Family**: Linux, Guest OS Version: Red Hat Enterprise Linux (64-bit)
-   **Hard Disk size**: 50GB, (Thin provisioning)
-   **Network**: A single network controller connected to the network or VLAN of your choice. All VMs will connect to this same network.
-   **Optional**: Remove the floppy drive

Install Red Hat Enterprise 7.6:

1.  Select a language.
2.  For the software selection, choose **Infrastructure Server** as the base environment and add the **Guest Agents** from the lists of add-ons available for this environment. 
3.  Configure the network settings so that you can later access the VM using SSH from your Ansible controller node. Specify an IP address for the network interface, a default gateway and DNS settings.
4.  Specify a password for the root account and optionally create an admin user.
5.  Wait for the installation to finish and for the VM to reboot.



## Update packages

- Change the hostname of the VM giving it a name that you will recognize in your Red Hat Account. This VM name is used as the value for the `support_template` variable in your `group_vars\all\vars.yml` configuration file. For example, to change the hostname of the VM to **ocp-rhel760** use the following command:

```
$ nmcli general hostname ocp-rhel760
```

- Register the system with the Red Hat Network and attach it to a subscription. You can do this using the following command if you have created activations keys:
```
$ subscription-manager register --org=<your_org> --activationkey=<activation key> --auto-attach
```

- If your Red Hat Network account does not use organization IDs and activation keys, you can instead register the server using your RHN username and password:
```
$ subscription-manager register --username <your_username> --password <your_password> --auto-attach
```

- Use `yum update` to install the latest packages:
```
$ yum -y update
```


- Install the `cloud-init` package, which will be used to customize any VMs created from this template VM:

```
$ yum install -y https://github.com/vmware/cloud-init-vmware-guestinfo/releases/download/v1.1.0/cloud-init-vmware-guestinfo-1.1.0-1.el7.noarch.rpm
```

- Un-register the system from the Red Hat Network and remove subscription data:

```
# subscription-manager unregister
```


## Finalize the template


Perform the following steps on the VM to finalize its creation:

1.  Remove any customizations from the VM by running the following commands from the **VMware Virtual Machine Console:**

    ```    
    $ rm /etc/ssh/ssh_host_*
    $ nmcli con del ens192
    $ logrotate -f /etc/logrotate.conf
    $ rm /var/log/*-201?*
    $ history -c		    
    ```


2.  If you have used a static IP address when creating the template, you should remove the networking configuration.


3.  Shutdown the VM

    ```
    $ shutdown -h now
    ```

4.  Convert the VM into a template by right-clicking on your VM in vCenter and selecting `Template -> Convert to Template`. The  VM will be replaced by a new template visible under VM Templates in Folders, ready for future use.

