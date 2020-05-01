# Networking configuration

|Variable|File|Description|
|:-------|:---|:----------|
|`vm_portgroup`|group_vars/all/vars.yml|The portgroup connected to the network that connects all the VMs. For example, `hpeOpenshift`|
|`dhcp_subnet`|group_vars/all/vars.yml|Subnet used by the playbooks to create a DHCP range on the above VLAN. For example, `10.15.155.0/24 `|
|`gateway`|group_vars/all/vars.yml|Gateway for the above subnet. For example, `'10.15.155.1'`|
|`domain_name`|group_vars/all/vars.yml|DNS domain name for cluster. For example, `hpecloud.org`|    
|`dns`|group_vars/all/vars.yml|List of DNS servers to be used, in list format. For example, `['10.10.173.1','10.10.173.2'...]`<br><br>The DNS services deployed by the solution forwards unresolved requests to these DNS servers.|
|`ntp_servers`|group_vars/all/vars.yml|List of NTP servers to be used, in list format. For example, `['1.2.3.4','0.us.pool.net.org'...]`|
