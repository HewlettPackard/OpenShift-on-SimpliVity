# Load balancer configuration

The solution supports a number of load balancer configuration options:

- Use the playbooks to configure two load balancers, for highly available, production deployments.
- Use the playbooks to configure a single load balancer, useful for proof of concept deployments.
- Deploy the solution using your own load balancers.


## Quick start

A sample configuration for deploying two load balancers is shown below. This extract from the Ansible `hosts` 
inventory file shows the entries defining the nodes used for the load balancers:

```
[loadbalancer]
ocp-lb1 ansible_host=10.15.155.7 frontend_ipaddr=10.15.156.40/24 api_int_preferred=
ocp-lb2 ansible_host=10.15.155.8 frontend_ipaddr=10.15.156.41/24 api_preferred=
```

This extract from the configuration file `group_vars/all/vars.yml` shows the networking configuration required for
the two load balancer scenario:

```
frontend_vm_portgroup: 'extVLAN2968'
frontend_gateway: '10.15.156.1''

loadbalancers:
  apps:
    vip: 10.15.156.42/24
  backend:
    vip: 10.15.155.9/24
    interface: ens192
    vrrp_router_id: 54
  frontend:
    vip: 10.15.156.42/24
    interface: ens224
    vrrp_router_id: 54
```

This configuration will be expanded on in the following sections.

## Deploying two load balancers

With this option, two load balancers are deployed in an active-active configuration to provide highly-available access.
These nodes run `keepalived` and `HAproxy`. The load balancers are hosted on two VMs that are prevented from running on
the same ESXi host through the use the following anti-affinity rule:

```
{{cluster_name}}-loadbalancer-anti-affinity-rule-001
```
where ``cluster_name`` is defined in the configuration file `group_vars/all/vars.yml`.


Two virtual machines are configured in the `hosts` inventory file, with each VM connected to an external (frontend)
network and an internal (backend) network. To achieve this, each load balancer must have two IP addresses specified,
one on the internal network using the `ansible_host` variable and a second address on the external network using
`frontend_ipaddr`. The latter should be specified in CIDR notation (for example `10.10.174.165/22`).
The internal network is determined by the `vm_portgroup` variable in your configuration file, while the external
network is set using the `frontend_vm_portgroup` variable.

You configure one of the VMs as the preferred VM for hosting the internal VIP for the OCP API, by adding
`api_int_preferred=` to the definition. Similarly, you configure the other VM as the preferred VM for hosting
the external VIP for the OCP API by adding `api_preferred=` to the entry. Note that the `=` sign is required 
for both settings. A sample `[loadbalancer]` group is shown below:

```
[loadbalancer]
ocp-lb1 ansible_host=10.15.155.7 frontend_ipaddr=10.15.156.40/24 api_int_preferred=
ocp-lb2 ansible_host=10.15.155.8 frontend_ipaddr=10.15.156.41/24 api_preferred=
```

The following variables must also be declared in your configuration file `group_vars/all/vars.yml`. The frontend
network must be defined, similar to the example below:

```
frontend_vm_portgroup: 'extVLAN2968' # Name of the portgroup / external network
frontend_gateway: '10.15.156.1'      # gateway for the external network
```

The `loadbalancers` variable in your configuration file `group_vars/all/vars.yml` is used to define the networking
configuration. A virtual IP (VIP) is specified for external access to applications, and for external (frontend) and
internal (backend) access to the OCP API. A sample `loadbalancers` definition is shown below:

```
loadbalancers:
  apps:
    vip: 10.15.156.9/24
  backend:
    vip: 10.15.155.9/24
    interface: ens192
    vrrp_router_id: 51
  frontend:
    vip: 10.15.156.9/24
    interface: ens224
    vrrp_router_id: 51
```

The names of the interfaces are OS-dependent and depend on how the VMs are built. Using the playbooks from the
`OpenShift-on-SimpliVity` repository with Red Hat Enterprise 7.6, the values of `ens192` (backend) and `ens224`
(frontend) should be appropriate.  The `vrrp_router_id` is used to differentiate between multiple deployments
on the same networking infrastructure, for example, in proof of concepts. If you have multiple deployments, ensure that 
each deployment uses unique VRRP router IDs.


## Deploying one load balancer

If you do not require high availability, you can deploy a single load balancer to reduce complexity and resource
requirements. In this instance, you only specify a single entry in the `[loadbalancer]` group in your `hosts` file.
The load balancer must have two IP addresses specified, one on the internal network using the `ansible_host` variable and
a second address on the external network using `frontend_ipaddr`.

```
[loadbalancer]
ocp-lb1 ansible_host=10.15.155.7 frontend_ipaddr=10.15.156.7/24
```

The frontend network must be defined in your configuration file `group_vars/all/vars.yml`, similar to the example below:

```
frontend_vm_portgroup: 'extVLAN2968' # Name of the portgroup / external network
frontend_gateway: '10.15.156.1'      # gateway for the external network
```

The definition for the `loadbalancers` variable is now simplified. No virtual IPs need to be specified. Instead, the two 
IP addresses of the load balancer VM are now used. From the example `hosts` file, `10.15.155.7` is used for internal
access to the OCP API (from `ansible_host=10.15.155.7`) while `10.15.156.7` is used for external access (from
`frontend_ipaddr=10.15.156.7`).
 
A sample `loadbalancers` definition is shown below:

```
loadbalancers:
  apps:
  backend:
    interface: ens192
  frontend:
    interface: ens224
```

Once again, the names of the interfaces are OS-dependent and depend on how the VMs are built. 
Using the playbooks from the `OpenShift-on-SimpliVity` repository with Red Hat Enterprise 7.6, the 
values of `ens192` (backend) and `ens224` (frontend) should be appropriate.  The `vrrp_router_id` variable 
is no longer needed in this instance.




## Using your own load balancers

To use your own load balancers, you should delete any entries in the `[loadbalancer]` group in your `hosts` file. 
Note that you must still include the `[loadbalancer]` group in the file. Your load balancers should be configured
to meet the requirements as specified in the OpenShift installation documentation
at [https://docs.openshift.com/container-platform/4.2/installing/installing_vsphere/installing-vsphere.html](https://docs.openshift.com/container-platform/4.2/installing/installing_vsphere/installing-vsphere.html)

The frontend network must be defined in your configuration file `group_vars/all/vars.yml`, similar to the example below:

```
frontend_vm_portgroup: 'extVLAN2968' # Name of the portgroup / external network
frontend_gateway: '10.15.156.1'      # gateway for the external network
```

The definition for the `loadbalancers` variable is again simplified but this time you just specify the virtual IPs
to be used. A sample `loadbalancers` definition is shown below:

```
loadbalancers:
  apps:
    vip: 10.15.156.9/24
  backend:
    vip: 10.15.155.9/24
  frontend:
    vip: 10.15.156.9/24
```


## Load balancer variables

The following table contains definitions for all the variables used when configuring your load balancers.

|Variable|File|Description|
|:-------|:---|:----------|
|`frontend_vm_portgroup`|group_vars/all/vars.yml|Name of the portgroup connected to the access/public network|
|`frontend_gateway`|group_vars/all/vars.yml|Access network gateway|
|`loadbalancers`|group_vars/all/vars.yml|A dictionary containing entries for `apps`, `backend` and `frontend`|
|`loadbalancers.apps`|group_vars/all/vars.yml|A dictionary containing entries specific to `apps` access|
|`loadbalancers.apps.vip`|group_vars/all/vars.yml|If ommited, defaults to the internal IP address of the first load balancer (ie no VIP, no HA)|
|`loadbalancers.backend`|group_vars/all/vars.yml|A dictionary containing entries specific to `backend` access|
|`loadbalancers.backend.vip`|group_vars/all/vars.yml|If ommited, defaults to the internal IP address of the first load balancer (ie no VIP, no HA)|
|`loadbalancers.backend.interface`|group_vars/all/vars.yml|Name of the internal (backend) interface. For example, `ens192` if using RHEL 7.6 with these playbooks|
|`loadbalancers.backend.vrrp_router_id`|group_vars/all/vars.yml|If you are deploying multiple clusters in the same environment, it is important to keep them separated using distinct VRRP IDs|
|`loadbalancers.frontend`|group_vars/all/vars.yml|A dictionary containing entries specific to `frontend` access|
|`loadbalancers.frontend.vip`|group_vars/all/vars.yml|If omitted, defaults to the external IP address of the first load balancer (i.e. no VIP, no HA)|
|`loadbalancers.frontend.interface`|group_vars/all/vars.yml|Name of the external (frontend) interface. For example, `ens224` if using RHEL 7.6 with these playbooks|
|`loadbalancers.frontend.vrrp_router_id`|group_vars/all/vars.yml|If you are deploying multiple clusters in the same environment, it is important to keep them separated using distinct VRRP IDs|
