# Editing the hosts file

The `hosts` file consists of definitions for:

- `Cluster nodes` including masters and workers
- `Supporting nodes` including a bootstrap node, support nodes for DNS and DHCP, and an NFS server
- `Groupings of nodes` such as all cluster nodes, all CoreOS nodes, all worker nodes, etc.


## Cluster nodes

### Master nodes
A minimum of three master nodes are required.

```
[master]
ocp-master0   ansible_host=10.15.155.210
ocp-master1   ansible_host=10.15.155.211
ocp-master2   ansible_host=10.15.155.212
```

### CoreOS worker nodes
A minimum of two CoreOS worker nodes must be specified in the `rhcos_worker` group 
for the initial cluster deployment.

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213
ocp-worker1   ansible_host=10.15.155.214
```

### Red Hat Enterprise Linux 7.6 worker nodes

RHEL 7.6 worker nodes can only be added to the  OCP cluster **after the cluster has been deployed**. 
The `rhel_worker` group in the `hosts` file is used to specify the details for these worker nodes.
Any entries in this group must be commented out during the initial cluster deployment.

```
[rhel_worker]
ocp-worker4   ansible_host=10.15.155.217
```

## Supporting nodes

### Bootstrap group

The cluster requires a single `bootstrap` machine to deploy the OpenShift Container Platform cluster on 
the three master nodes. You can safely remove the bootstrap machine from vCenter after the cluster has deployed.

```
[bootstrap]
ocp-bootstrap ansible_host=10.15.155.209
```

### Support group

The solution provisions DNS and DHCP services on one or two `support` nodes.  For High Availability (HA)
purposes in a production environment, you should configure two support nodes. 
For proof of concept deployments, one node should be sufficient.

```
[support]
ocp-support1   ansible_host=10.15.155.5
ocp-support2   ansible_host=10.15.155.6
```

### Load balancers

The playbooks can be used to deploy one or two load balancers using the
information in the `loadbalancer` group. Alternatively, you can leave this group empty and 
configure your own load balancers. For more information, see the section on [Load balancer configuration](lbs-config).

```
[loadbalancer]
ocp-lb1       ansible_host=10.15.155.17  frontend_ipaddr=10.15.156.40/22 api_int_preferred=
ocp-lb2       ansible_host=10.15.152.8   frontend_ipaddr=10.15.156.8/24 api_preferred=
```

### NFS server

The solution deploys a single NFS server to provide persistent storage as required by the OCP image registry.

```
[nfs]
ocp-nfs       ansible_host=10.15.155.10
```



## Groups of groups

Some groups are combined in the `hosts` file for the convenience of the playbooks. These "groups of groups" include:

- `worker` group, a combination of the `rhcos_worker` and `rhel_worker` groups
- `rhcos` group, made up of `bootstrap`, `master` and `rhcos_worker` nodes
- `ocp` group, comprising the `master` and the `worker` nodes

These groups are used by the deployment playbooks and should not be modified.


## General recommendations

- The recommended naming convention for cluster nodes is  ``<<cluster_name>>``-``<<node-type>><<node-number>>``, with
node numbering typically starting at 0. This gives rise to entries such as  `ocp-master0`, `ocp-worker3`,
`ocp-lb1`, `ocp-support0`, etc. 

- Underscores (`_`) are not valid characters in hostnames.

- Make sure you change all the IP addresses in the sample files to match your environment.

- The `[support]` group can contain one or two nodes for deploying required support components
such as DNS and DHCP. If you want High Availability (HA), you need to configure two VMs, otherwise one 
will be sufficient.

- RHEL 7.6 worker nodes can only be deployed **after the initial cluster deployment has completed successfully**. As a
result, the `[rhel_worker]` group should be empty (entries can be commented out) before running or
re-running the `site.yml` playbook.

- The `[loadbalancer]` group can contain zero, one or two entries. To deploy highly available load balancers,
you need to configure two VMs, otherwise one will be sufficient. You may use your own load balancing solution by 
leaving the `[loadbalancer]` inventory group empty and configuring the `loadbalancers` data structure 
(in the `group_vars/all/vars.yml` variables file) to reflect your load balancer configuration.
