# VMware configuration

All variables related to VMware configuration are described in the table below.

|Variable|File|Description|
|:-------|:---|:----------|
|`vcenter_hostname`|group_vars/all/vars.yml|IP or hostname of the vCenter appliance. For example, `vcentergen10.am2.cloudra.local`|
|`vcenter_username`|group_vars/all/vars.yml|Username to log in to the vCenter appliance. It might include a domain, for example, '`Administrator@vsphere.local`'|
|`vault.vcenter_password`|**group_vars/all/vault.yml**|The password for the `vcenter_username` user.|
|`vcenter_validate_certs`|group_vars/all/vars.yml|Not implemented/tested. Always set to `false`|
|`vcenter_cluster`|group_vars/all/vars.yml|Name of your SimpliVity Cluster. For example `OCP`|
|`datacenter`|group_vars/all/vars.yml|Name of the datacenter where the environment will be provisioned. For example, `DEVOPS`|
|`datastores`|group_vars/all/vars.yml|List of datastores for storing VMs. For example, ['Openshift_HPE']|
|`cluster_name`|group_vars/all/vars.yml|Name of the K8S Cluster. A VM folder with the same name is created if needed|
