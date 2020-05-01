# Inventory group variables

## Group files

The following files, in the `group_vars` folder, contain variable definitions for each group  of OCP cluster nodes. 
These group files facilitate more sophisticated settings, such as additional network interfaces.


|File|Description|
|:---|:----------|
|`group_vars/bootstrap.yml`|Variables defined for the node in the `[bootstrap]` group|
|`group_vars/infrastructure.yml`|Variables defined for all nodes in the `[infrastructure]` group|
|`group_vars/loadbalancer.yml`|Variables defined for all nodes in the `[loadbalancer]` group|
|`group_vars/nfs.yml`|Variables defined for all nodes in the `[nfs]` group|
|`group_vars/master.yml`|Variables defined for all nodes in the `[master]` group|
|`group_vars/rhcos_worker.yml`|Variables defined for all nodes in the `[rhcos_worker]` group|
|`group_vars/rhel_worker.yml`|Variables defined for all nodes in the `[rhel_worker]` group|


## Overriding group variables

If you wish to configure individual nodes with different specifications to the ones defined by the group, it is possible to declare the same variables at the node level, overriding the group value. For exanple, if the default CPU and memory resource limits defined in for your worker nodes in the `group_vars/worker.yml` file are not sufficient for all worker nodes, you can override these values in their respective `hosts` entries.  For example, if these are the CPU, RAM, and disk limits specified at the group level:

```   
cpus: '4'                                               # Number of vCPUs
ram: '16384'                                            # RAM size in MBs
disk1_size: '120'                                       # Disk size in GBs
```

you can override these values in the individual node entries in the `hosts` file:

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213
ocp-worker1   ansible_host=10.15.155.214
ocp-worker2   ansible_host=10.15.155.215  cpus=8 ram=32768  # Larger worker node for EFK
ocp-worker3   ansible_host=10.15.155.216  cpus=8 ram=32768  # Larger worker node for EFK
ocp-worker4   ansible_host=10.15.155.217  cpus=8 ram=32768  # Larger worker node for EFK
```

In the example above, three CoreOS worker nodes (`ocp-worker2`, `ocp-worker3`, `ocp-worker4`)  are allocated  two times more virtual CPU cores and double the RAM compared to the rest of the CoreOS worker nodes.


## Common variables across all groups

The following variables apply to all node groups:

|Variable|Scope|Description|
|:-------|:----|:----------|
|`ip_addr`|All nodes|IP address in CIDR format to be given to a node|
|`esxi_host`|All nodes|ESXi host where the node will be deployed. If the cluster is configured with DRS, this option will be overridden|
|`cpus`|All nodes/groups|Number of virtual CPU cores to assign to a VM or a group of VMs|
|`ram`|All nodes/groups|Amount of RAM in MB to assign to a VM or a group of VMs|
|`disk1_size`|All nodes/groups|Size of the disk in GB to attach to a VM or a group of VMs. |
|`folder`|All nodes/groups|The folder where the VM will be stored|
|`template`|All nodes/groups|Override the default template for the node or group. <br><br>The Bootstrap node (`[bootstrap]` uses the CoreOS template specified by ``<<master_template>>``.<br><br>Infrastructure and supporting nodes (`[infrastructure]`, `[loadbalancer]`, `[nfs]`) use the RHEL template specified by ``<<infra_template>>`` by default. <br><br>The master nodes (`[master]`) use the CoreOS template specified by ``<<master_template>>``. <br><br>The CoreOS worker nodes (`[rhcos_worker]`) use  the CoreOS template specified by ``<<worker_template>>``, which is typically the same as <<master_template>>.<br><br>For RHEL worker nodes (`[rhel_worker]`), you should set the group default to name of the RHEL template you typically use. |
|`ova_path`|All nodes/groups|Name of the OVA used to import the template. <br><br>The Bootstrap node (`[bootstrap]` uses the CoreOS OVA specified by ``<<master_ova_path>>``.<br><br>Infrastructure and supporting nodes (`[infrastructure]`, `[loadbalancer]`, `[nfs]`) use the RHEL OVA specified by ``<<infra_ova_path>>`` by default. <br><br>The master nodes (`[master]`) use the CoreOS OVA specified by ``<<master_ova_path>>``. <br><br>The CoreOS worker nodes (`[rhcos_worker]`) use  the CoreOS OVA specified by ``<<worker_ova_path>>``, which is typically the same as ``<<master_template>>``.<br><br>For RHEL worker nodes (`[rhel_worker]`), you should set the group default to name of the RHEL OVA you typically use.|