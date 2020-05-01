# Workload placement

You may want to control the placement of certain workloads on specific nodes in your cluster. Sample
workloads might include:

- OpenShift Container Platform infrastructure components such as the default router, the container image registry and the cluster metrics collection (monitoring service)
- Cluster aggregated logging. While this is also an OpenShift Container Platform infrastructure component, the specific CPU and memory requirements may lead you to placing this infrastructure component on dedicates nodes
- AI and machine learning workloads that may require nodes with GPUs

While you could attempt to use the specifications for default and maximum resource requirements (CPU and memory)
to determine placement, node labels provide a more powerful and flexible mechanism. In order to add
labels to OCP nodes, you can edit your `hosts` inventory file to include the labels and then run the playbook
`playbooks/label.yml`.

## Infrastructure nodes

The following OpenShift Container Platform components are infrastructure components:

- Kubernetes and OpenShift Container Platform control plane services that run on masters
- The default router
- The container image registry
- The cluster metrics collection, or monitoring service
- Cluster aggregated logging
- Service brokers

You can dedicate some of your worker nodes to perform the role of infrastructure nodes, by setting the
label `node-role.kubernetes.io/infra` on the specific nodes.

The following example assumes you have five ordinary worker nodes, with the following specification
in your `hosts` file:

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213
ocp-worker1   ansible_host=10.15.155.214
ocp-worker2   ansible_host=10.15.155.215
ocp-worker3   ansible_host=10.15.155.216
ocp-worker4   ansible_host=10.15.155.217
```

When you run the `oc get nodes` command, you should just see the `worker` role associated
with these nodes:

```
$ oc get nodes
NAME          STATUS   ROLES    AGE   VERSION
ocp-master0   Ready    master   41h   v1.14.6+31a56cf75
ocp-master1   Ready    master   41h   v1.14.6+31a56cf75
ocp-master2   Ready    master   41h   v1.14.6+31a56cf75
ocp-worker0   Ready    worker   41h   v1.14.6+31a56cf75
ocp-worker1   Ready    worker   41h   v1.14.6+31a56cf75
ocp-worker2   Ready    worker   22m   v1.14.6+31a56cf75
ocp-worker3   Ready    worker   22m   v1.14.6+31a56cf75
ocp-worker4   Ready    worker   22m   v1.14.6+31a56cf75
```

In this example, three worker nodes (`ocp-worker2`, `ocp-worker3`, `ocp-worker4`) will be tagged as 
infrastructure nodes. In your hosts file, add the appropriate label to these three nodes as shown below:

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213
ocp-worker1   ansible_host=10.15.155.214
ocp-worker2   ansible_host=10.15.155.215 k8s_labels='{"node-role.kubernetes.io/infra":""}'
ocp-worker3   ansible_host=10.15.155.216 k8s_labels='{"node-role.kubernetes.io/infra":""}'
ocp-worker4   ansible_host=10.15.155.217 k8s_labels='{"node-role.kubernetes.io/infra":""}'
```

Run the playbook `playbooks/label.yml` to associate the label with the nodes:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/label.yml
```

Now, when you run the command `oc get nodes`, you will see that the roles for these three nodes are
`infra,worker`:

```
$ oc get nodes

NAME          STATUS   ROLES          AGE   VERSION
ocp-master0   Ready    master         41h   v1.14.6+31a56cf75
ocp-master1   Ready    master         41h   v1.14.6+31a56cf75
ocp-master2   Ready    master         41h   v1.14.6+31a56cf75
ocp-worker0   Ready    worker         41h   v1.14.6+31a56cf75
ocp-worker1   Ready    worker         41h   v1.14.6+31a56cf75
ocp-worker2   Ready    infra,worker   25m   v1.14.6+31a56cf75
ocp-worker3   Ready    infra,worker   25m   v1.14.6+31a56cf75
ocp-worker4   Ready    infra,worker   25m   v1.14.6+31a56cf75
```


**Note:** It would be advisable to create anti-affinity rules for your infrastructure nodes,
to ensure that VMs performing the same role are kept apart and run on different underlying ESXi hosts.

## Custom labels

You can add your own labels to nodes, to assist in workload placement. To see what labels are already
on a node, you can use the `--show-labels` flag on the `oc get node` command:

```
$ oc get node --show-labels ocp-worker0

NAME          STATUS   ROLES    AGE   VERSION             LABELS
ocp-worker0   Ready    worker   41h   v1.14.6+31a56cf75   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=ocp-worker0,kubernetes.io/os=linux,node-role.kubernetes.io/worker=,node.openshift.io/os_id=rhcos
```

Update your `hosts` inventory file with your custom labels, for example, `mylabel`:

```
[rhcos_worker]
ocp-worker0   ansible_host=10.15.155.213 k8s_labels='{"mylabel":"yes"}'
ocp-worker1   ansible_host=10.15.155.214 k8s_labels='{"mylabel":"yes"}'
ocp-worker2   ansible_host=10.15.155.215 k8s_labels='{"node-role.kubernetes.io/infra":"", "mylabel":"yes"}'
ocp-worker3   ansible_host=10.15.155.216 k8s_labels='{"node-role.kubernetes.io/infra":""}'
ocp-worker4   ansible_host=10.15.155.217 k8s_labels='{"node-role.kubernetes.io/infra":""}'
```

Now run the `playbooks/label.yml` playbook again to add the custom label to the appropriate nodes:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/label.yml
```

Re-run the `oc get node` command to see the custom label added to the nodes:

```
oc get node --show-labels ocp-worker0

NAME          STATUS   ROLES    AGE   VERSION             LABELS
ocp-worker0   Ready    worker   41h   v1.14.6+31a56cf75   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=ocp-worker0,kubernetes.io/os=linux,mylabel=yes,node-role.kubernetes.io/worker=,node.openshift.io/os_id=rhcos
```

Notice also how the infrastructure node `ocp-worker2` has been updated with the custom label `mylabel`, adding to the
`node-role.kubernetes.io/infra` label from earlier:

```
$ oc get node --show-labels ocp-worker2

NAME          STATUS   ROLES          AGE   VERSION             LABELS
ocp-worker2   Ready    infra,worker   28m   v1.14.6+31a56cf75   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=ocp-worker2,kubernetes.io/os=linux,mylabel=yes,node-role.kubernetes.io/infra=,node-role.kubernetes.io/worker=,node.openshift.io/os_id=rhcos
```

## Moving router replicas to infrastructure nodes

If you want to move router replicas to your instrastructure nodes, you can configure the approriate custom resource. First, check what nodes your routers are currently running on:

```
$ oc get pod -n openshift-ingress -o wide

NAME                              READY   STATUS    RESTARTS   AGE   IP              NODE          NOMINATED NODE   READINESS GATES
router-default-5f4497984c-qpjsr   1/1     Running   0          41h   10.15.155.214   ocp-worker1   <none>           <none>
router-default-5f4497984c-t9bxw   1/1     Running   0          41h   10.15.155.213   ocp-worker0   <none>           <none>
```

Update the custom resource to specify that you want this component placed on the infrastructure nodes:

```
$ oc patch ingresscontroller/default --type=merge -n openshift-ingress-operator -p '{"spec": {"nodePlacement":{"nodeSelector":{"matchLabels":{"node-role.kubernetes.io/infra": ""}}}}}'

ingresscontroller.operator.openshift.io/default patched

```

Now check the two router pods to see them migrating to the infrastructure nodes:

```
$ oc get pod -n openshift-ingress -o wide

NAME                              READY   STATUS              RESTARTS   AGE   IP              NODE
router-default-588447654b-cdnkr   0/1     ContainerCreating   0          3s    10.15.155.216   ocp-worker3
router-default-5f4497984c-qpjsr   0/1     Terminating         0          41h   10.15.155.214   ocp-worker1
router-default-5f4497984c-t9bxw   1/1     Running             0          41h   10.15.155.213   ocp-worker0
```

The routers will be terminated, one at a time, and restarted on an infrastructure node:

```
$ oc get pod -n openshift-ingress -o wide
NAME                              READY   STATUS              RESTARTS   AGE   IP              NODE
router-default-588447654b-cdnkr   1/1     Running             0          20s   10.15.155.216   ocp-worker3
router-default-588447654b-gt9cg   0/1     ContainerCreating   0          2s    10.15.155.217   ocp-worker4
router-default-5f4497984c-t9bxw   0/1     Terminating         0          41h   10.15.155.213   ocp-worker0
```

Finally, both routers will have moved to infrastructure nodes, in this case from `ocp-worker0` and `ocp-worker1` to
`ocp-worker3` and `ocp-worker4`:

```
$ oc get pod -n openshift-ingress -o wide
NAME                              READY   STATUS    RESTARTS   AGE   IP              NODE
router-default-588447654b-cdnkr   1/1     Running   0          25s   10.15.155.216   ocp-worker3
router-default-588447654b-gt9cg   1/1     Running   0          7s    10.15.155.217   ocp-worker4
```

More information on how to move router components is available in the documentation at [https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-router_creating-infrastructure-machinesets](https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-router_creating-infrastructure-machinesets)

## Moving other infrastructure components

The OpenShift Container Platform documentation contains information on how to migrate other infrastructure components:

- **image registry:** [https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-registry_creating-infrastructure-machinesets](https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-registry_creating-infrastructure-machinesets)
- **monitoring resources:** [https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-monitoring_creating-infrastructure-machinesets](https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-monitoring_creating-infrastructure-machinesets)
- **cluster logging:** [https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-logging_creating-infrastructure-machinesets](https://docs.openshift.com/container-platform/4.2/machine_management/creating-infrastructure-machinesets.html#infrastructure-moving-logging_creating-infrastructure-machinesets)
