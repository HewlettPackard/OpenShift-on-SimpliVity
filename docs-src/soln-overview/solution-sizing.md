# Solution sizing

By default, the Ansible playbooks create VMs according to the following recommended specifications. You can override
these recommended values in the configuration files, as detailed in the section
[Configuring the solution](../config-core/ansible-config).


## Bootstrap node

A single bootstrap node is required to assist in the OCP deployment. You can delete the bootstrap VM after the cluster
has been successfully deployed.

|VM|Number|OS|Sizing|Comments|
|:-------|:---:|:---|:----------|:----------|
|Bootstrap|1|CoreOS|4x&nbsp;vCPU<br>16GB&nbsp;RAM<br>120GB&nbsp;disk&nbsp;space|This is the RH minimum requirement|



## Supporting nodes

Two supporting nodes are deployed by default, providing DHCP and DNS services for the cluster. Two load balancer VMs and an NFS VM are also configured.

|VM|Number|OS|Sizing|Comments|
|:-------|:---:|:---|:----------|:----------|
|Support|2|RHEL&nbsp;7.6|2x&nbsp;vCPU<br>4GB&nbsp;RAM<br>60GB&nbsp;disk&nbsp;space|Providing DHCP and DNS services on the internal VLAN. You can configure one (no HA)|
|Load balancers|2|RHEL 7.6|2x&nbsp;vCPU<br>4GB RAM<br>60GB disk space|Two load balancers are deployed by default. You can configure one (no HA) or 0 where you use your own existing load balancers|
|NFS|1|RHEL 7.6|2x&nbsp;vCPU<br>4GB RAM<br>60GB disk space|Required for persistent storage for the OpenShift Registry|

## OCP cluster nodes

By default, 3 master nodes are deployed for high availability. A minimum of 2 worker nodes are required.

|VM|Number|OS|Sizing|Comments|
|:-------|:---:|:---|:----------|:----------|
|Masters|3|CoreOS|4x&nbsp;vCPU<br>16GB&nbsp;RAM<br>120GB&nbsp;disk&nbsp;space|This is the RH minimum requirement|
|Workers|2|CoreOS|2x&nbsp;vCPU<br>16GB RAM<br>120GB disk space|This is the RH minimum requirement|

Similar sizing requirements will apply for any worker nodes (CoreOS or RHEL) added to the cluster after the
initial deployment.

## OCP infrastructure components

The following OpenShift Container Platform components are infrastructure components:

- Kubernetes and OpenShift Container Platform control plane services that run on masters
- The default router
- The container image registry
- The cluster metrics collection, or monitoring service
- Cluster aggregated logging
- Service brokers

Any node that runs any other container, pod, or component is a worker node that your Red Hat OpenShift subscription must cover.


The default router, image registry and monitoring service are initially deployed on the two worker nodes. These can be rescheduled onto specific infrastructure nodes as outlined in the section
[Post deployment tasks](../post-deploy/post-deploy-intro).


## Cluster Logging
 Cluster logging is very resource intensive, so the sizing requirements are increased compared to other nodes
 in the cluster. The playbooks now support two different profiles for cluster logging. The `small` profile deploys a single instance of Elasticsearch and a single instance of Kibana, with reduced CPU and memory requirements. This is useful for proof of concept deployments, where there may be limited resources and no need for redundancy. In contrast, the `large` profile can be used to deploy a highly available, production-ready instance of cluster logging.

The following table shows the suggested sizing requirements for the the production-ready `large` deployment.

|VM|Number|OS|Sizing|Comments|
|:-------|:---:|:---|:----------|:----------|
|Logging|3|CoreOS|8x&nbsp;vCPU<br>32GB&nbsp;RAM<br>120GB&nbsp;disk&nbsp;space|This is the RH recommended requirement|

Cluster logging is not deployed by default. Instructions for deploying the logging stack and scheduling it
on specific nodes with the required resources is described in the section
[Deploying cluster logging](../logging/logging-intro).


