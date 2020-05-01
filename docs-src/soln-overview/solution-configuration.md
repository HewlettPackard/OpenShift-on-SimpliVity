# Solution configuration

The solution deploys an OCP cluster and a number of supporting nodes, as shown in the figure below.

![" Solution overview, including optional cluster logging stack configured after initial deployment"][media-simplivity-openshift-architecture-png] 

**Figure. Solution overview, including optional cluster logging stack configured after initial deployment**


## Cluster nodes
The OCP cluster consists of two distinct types of nodes:

- Master nodes: A minimum of three master nodes are required for the control plane.
- CoreOS worker nodes: A minimum of two CoreOS worker nodes must be specified for the infrastructure components in  the initial cluster deployment. The default router, image registry and monitoring service are initially deployed on these two worker nodes, along with any applications you subsequently deploy. The worker nodes will be distributed randomly, so they may not be spread across the ESXi hosts as depicted in the figure. 


## Supporting nodes
In addition to the cluster nodes, a number of supporting nodes are also deployed. They are:

- Bootstrap: A single bootstrap machine is used to deploy the Red Hat OpenShift Container Platform cluster on the three master nodes. You can safely remove the bootstrap machine from vCenter® after the cluster has deployed.
- DNS and DHCP: The solution provisions DNS and DHCP services on one or two support nodes. For high availability (HA) purposes in a production environment, you should configure two support nodes. For proof of concept deployments, one node should be sufficient.
- Load balancers: The playbooks can be used to deploy one or two load balancers depending on your high availability requirements. Alternatively, you can configure your own load balancers. For more information, see the  on [Load balancer configuration](../config-core/lbs-config).
- NFS server: The solution deploys a single NFS server to provide persistent storage as required by the OCP image registry.

## Cluster logging
Cluster logging is very resource intensive and is not deployed by default. A separate playbook
is provided to configure cluster logging after the initial deployment. The playbook does not
create anti-affinity rules for the logging VMs, so the actual distribution may differ from 
that depicted in the solution overview diagram. For more information, see the section on [Cluster logging](../logging/logging-intro).

## Red Hat Enterprise Linux 7.6 worker nodes
RHEL 7.6 worker nodes can be deployed as an alternative to CoreOS worker nodes, but can only 
be added to the OCP cluster after the cluster has been deployed. For more information, see 
the section on [Deploying RHEL worker nodes](../worker-nodes/rhel).



[media-simplivity-openshift-architecture-png]:<../images/simplivity-openshift-architecture.png> "Figure.  Solution overview, including optional cluster logging stack configured after initial deployment"



