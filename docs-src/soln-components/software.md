# Software

The software components used in this Reference Configuration are listed below.


**Table.** Third-party software

|Component|Software|Tested version|
|:-------|:-------|:---|
|**Ansible Controller**|OS|Fedora 31|
| |Ansible|2.8.5|
| |Python|3.7.5|
|**Red Hat OpenShift**|OCP client|4.2.9|
| |OCP server|4.2.9|
| |Red Hat CoreOS|4.2.0|
| |Red Hat Enterprise Linux|7.6|
|**VMware**|ESXi Host|6.7 Update 3 (VMware ESXi, 6.7.0, 14320388)|
| |vCenter|6.7 Update 3b (6.7.0.42000, build 15132721)|
| |CSI Plugin|1.0.1|

<br>
<br>

**Table.** HPE Software

|Component|Software|Tested version|
|:-------|:-------|:---|
|**HPE SimpliVity**|OmniStack|4.0.0.1249|
| |vSphere Plugin|4.0.0.179|


## About Ansible
Ansible is an open-source automation engine that automates software provisioning, configuration management and application deployment.

As with most configuration management software, Ansible has two types of servers: the controlling machine and the nodes. A single controlling machine orchestrates the nodes by deploying modules to the Linux nodes over SSH. The modules are temporarily stored on the nodes and communicate with the controlling machine through a JSON protocol over the standard output. When Ansible is not managing nodes, it does not consume resources because no daemons or programs are executing for Ansible in the background. Ansible uses one or more inventory files to manage the configuration of the multiple nodes in the system.

More information about Ansible can be found at [http://docs.ansible.com](http://docs.ansible.com)

