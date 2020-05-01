# Verify prerequisites

Before you start deployment, you must assemble the information required to assign values for each
variable used by the playbooks. The variables are fully documented in the section 
[Configuring the solution](../config-core/ansible-config).
A brief overview of the information required is presented in the table below.


|Component|Details|Comments|
|:-------|:---|:----------|
|Virtual Infrastructure|ESXi cluster of three machines<br><br>vCenter 6.7U3 (CSI)<br><br>vCenter 6.7U2 (non-CSI)|If you want HA you need three machines in the cluster and you need to deploy 3 masters, one per machine. <br><br>The FQDN of your vCenter server and the name of the Datacenter. You will also need administrator credentials in order to create templates and spin up virtual machines.|
|VLAN with access to Internet <br>(to pull Red Hat artifacts)|Portgroup connected to all machines in your ESX cluster|The playbooks install DHCP services on this VLAN so no other DHCP service should be running on this VLAN<br><br>You will need one IP address for each VM configured in the Ansible inventory.<br><br>For more information, see the section on [Proxy configuration](../config-core/proxy-config).|
|Routed subnet for use on the above VLAN|||
|Frontend Network / VLAN|  |External IP address for each load balancer plus one for the frontend VIP |
|NTP Services|IP addresses of time servers (NTP)|Time services must be configured in your environment. The deployed solution uses certificates that are time-sensitive.|
|DNS Services|IP addresses of DNS servers|The DNS services deployed by the solution forwards unresolved requests to these DNS servers|
|Red Hat Network Subscription|Organization ID and authorization key<br>Alternatively a username and password.|The subscription must contain valid licenses for both Red Hat Enterprise Linux 7.6 and OpenShift Container Platform 4|


