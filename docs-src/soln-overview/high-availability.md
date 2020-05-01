# High availability


Anti-affinity rules are created to ensure that most VMs performing the same role are kept apart and run on different 
underlying ESXi hosts.

## Control plane

The default configuration for the solution is three master nodes running on three separate ESXi hosts. The control plane
VMs  are guaranteed to run on two different ESXi hosts through the use of an anti-affinity rule named

```
{{cluster_name}}-master-anti-affinity-rule-001
```
where `cluster_name` is the name of your cluster, as defined in the `group_vars/all/vars.yml` file.

## Deploying two support nodes

You can configure the internal DNS and DHCP services to run on two virtual machines to provide redundancy. These two VMs
are guaranteed  to run on  two different ESXi hosts through using an anti-affinity rule named

```
{{cluster_name}}-support-anti-affinity-rule-001
```

where `cluster_name` is the name of your cluster, as defined in the `group_vars/all/vars.yml` file.


## Deploying two load balancers

You can configure the playbooks to deploy  two load balancers in an active-active configuration to provide
high availability access. These nodes run `keepalived` and `HAproxy`. The load balancers are hosted on two VMs that are
guaranteed to run on two different ESXi host through using an anti-affinity rule named

```
{{cluster_name}}-loadbalancer-anti-affinity-rule-001
```

where `cluster_name` is the name of your cluster, as defined in the `group_vars/all/vars.yml` file.

## Deploying cluster logging

Cluster logging is not deployed by default. Deployment of the logging stack and how to schedule it
on nodes with the required resources is described in the section 
[Deploying cluster logging](../logging/logging-intro).
