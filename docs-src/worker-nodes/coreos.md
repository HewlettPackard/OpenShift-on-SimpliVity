# Deploying CoreOS worker nodes


As part of the initial deployment of the OpenShift cluster, two Red Hat Core OS workers are configured by default.
These workers are defined in the `[rhcos_worker]` group in the `hosts` inventory file:

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213 
ocp-worker1   ansible_host=10.15.155.214
```

The sample configuration for the initial cluster is three CoreOS master nodes and two CoreOS worker nodes:

```
$ oc get nodes

NAME          STATUS   ROLES    AGE    VERSION
ocp-master0   Ready    master   2d2h   v1.14.6+c7d2111b9
ocp-master1   Ready    master   2d2h   v1.14.6+c7d2111b9
ocp-master2   Ready    master   2d2h   v1.14.6+c7d2111b9
ocp-worker0   Ready    worker   2d2h   v1.14.6+c7d2111b9
ocp-worker1   Ready    worker   2d2h   v1.14.6+c7d2111b9
```

To deploy additional CoreOS worker nodes, add new entries to the `[rhcos_worker]` group, for example:

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213 
ocp-worker1   ansible_host=10.15.155.214
ocp-worker2   ansible_host=10.15.155.215 
ocp-worker3   ansible_host=10.15.155.216 
```

Run the Ansible playbook `playbooks/scale.yml` to deploy the new CoreOS nodes:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/scale.yml --vault-password-file .vault_pass
```

The playbook will provision new VMs for the nodes, and these should automatically join the cluster after a few minutes.
You can observe the nodes joining the cluster via the `oc get nodes` command. Initially, the nodes will report 
as not ready:

```
$ oc get nodes

NAME          STATUS     ROLES    AGE    VERSION
ocp-master0   Ready      master   2d3h   v1.14.6+c7d2111b9
ocp-master1   Ready      master   2d3h   v1.14.6+c7d2111b9
ocp-master2   Ready      master   2d3h   v1.14.6+c7d2111b9
ocp-worker0   Ready      worker   2d3h   v1.14.6+c7d2111b9
ocp-worker1   Ready      worker   2d3h   v1.14.6+c7d2111b9
ocp-worker2   NotReady   worker   5s     v1.14.6+c7d2111b9
ocp-worker3   NotReady   worker   35s    v1.14.6+c7d2111b9
```

After a minute or two, the status should change to `Ready`:

```
$ oc get nodes

NAME          STATUS   ROLES    AGE    VERSION
ocp-master0   Ready    master   2d3h   v1.14.6+c7d2111b9
ocp-master1   Ready    master   2d3h   v1.14.6+c7d2111b9
ocp-master2   Ready    master   2d3h   v1.14.6+c7d2111b9
ocp-worker0   Ready    worker   2d3h   v1.14.6+c7d2111b9
ocp-worker1   Ready    worker   2d3h   v1.14.6+c7d2111b9
ocp-worker2   Ready    worker   45s    v1.14.6+c7d2111b9
ocp-worker3   Ready    worker   75s    v1.14.6+c7d2111b9
```

## Removing CoreOS nodes

If you want to reduce the number of CoreOS worker nodes (for example, you may have replaced them with RHEL worker nodes),
you need to use the following procedure.

For each node that you want to remove, you must:

- Mark the node as unschedulable
- Drain all the pods from the node
- Delete the node

Finally, remove the nodes from your load balancers and delete the VMs.


For more information on removing CoreOS nodes, see the documentation at [https://docs.openshift.com/container-platform/4.2/machine_management/adding-rhel-compute.html#rhel-removing-rhcos_adding-rhel-compute](https://docs.openshift.com/container-platform/4.2/machine_management/adding-rhel-compute.html#rhel-removing-rhcos_adding-rhel-compute)
