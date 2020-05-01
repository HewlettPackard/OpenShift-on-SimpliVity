# Playbook for cluster logging

Before running the playbook, you should log in as an admin user (either `kubeadmin` or
any other user that has the `cluster_admin` role):


```
$ export KUBECONFIG ~/.ocp/auth/kubeconfig
$ oc login -u kubeadmin -p <password>
$ cd ~/OpenShift-on-SimpliVity
```

## Deploying the small profile

After making the customizations appropriate to your environment, deploy the `small` EFK stack. In the following example, 
the configuration specified:

```
efk_channel=4.2
efk_profile="small"
```

Run the `playbooks/efk.yml` playbook:

```
$ ansible-playbook -i hosts playbooks/efk.yml
```

The playbook takes approximately 1-2 minutes to complete.  However, it may take several additional minutes for the
various Cluster Logging components to successfully deploy to the OpenShift Container Platform cluster. 
You can observere the logging pods being created:

```
$ oc get pod -n openshift-logging

NAME                                            READY   STATUS              RESTARTS   AGE
cluster-logging-operator-789f86bc5d-52864       1/1     Running             0          36s
elasticsearch-cdm-98n13kgt-1-68c7c496b7-7h58d   0/2     ContainerCreating   0          14s
fluentd-4xxjm                                   0/1     ContainerCreating   0          13s
fluentd-ds6v7                                   0/1     ContainerCreating   0          13s
fluentd-gp6mn                                   0/1     ContainerCreating   0          13s
fluentd-mv29x                                   0/1     ContainerCreating   0          13s
fluentd-pnpgj                                   0/1     ContainerCreating   0          13s
fluentd-sfkcl                                   0/1     ContainerCreating   0          13s
kibana-6db8448b8c-whlfc                         0/2     ContainerCreating   0          14s
```

Once the pods are ready, you can check the distribution of the pods across the nodes. Fluentd is deployed on each
node in the cluster, while only one instance of Elasticsearch and one of Kibana is deployed.

```
$ kubectl get pod -n openshift-logging -o custom-columns='Name:{.metadata.name},Node:{.spec.nodeName}'

Name                                            Node
cluster-logging-operator-789f86bc5d-52864       ocpp-worker2
elasticsearch-cdm-98n13kgt-1-68c7c496b7-7h58d   ocpp-worker2
fluentd-4xxjm                                   ocpp-master1
fluentd-ds6v7                                   ocpp-worker2
fluentd-gp6mn                                   ocpp-master2
fluentd-mv29x                                   ocpp-master0
fluentd-pnpgj                                   ocpp-worker1
fluentd-sfkcl                                   ocpp-worker0
kibana-6db8448b8c-whlfc                         ocpp-worker2
```

You can see the mininim and maximum resource requirements for the small Elasticsearch pod, using the `oc describe pod`
command, in the `Requests` and `Limits` fields:

```
$ oc describe pod elasticsearch-cdm-98n13kgt-1-68c7c496b7-7h58d -n openshift-logging
Name:               elasticsearch-cdm-98n13kgt-1-68c7c496b7-7h58d
Namespace:          openshift-logging
Priority:           0
PriorityClassName:  <none>
Node:               ocpp-worker2/10.15.163.215
Start Time:         Fri, 13 Dec 2019 09:01:26 -0500
...
Status:             Running
IP:                 10.129.2.9
Controlled By:      ReplicaSet/elasticsearch-cdm-98n13kgt-1-68c7c496b7
Containers:
  elasticsearch:
    Container ID:   cri-o://7baffe9ccc070660805a8fe42d6f62564420b893aa547b570b3342944a10ca43
    Image:          registry.redhat.io/openshift4/ose-logging-elasticsearch5@sha256:ddcead06ec96b837804f8299d6cbd6ba33e46c9555cdc96a7aba8c820f9bd29f
    Image ID:       registry.redhat.io/openshift4/ose-logging-elasticsearch5@sha256:ddcead06ec96b837804f8299d6cbd6ba33e46c9555cdc96a7aba8c820f9bd29f
    Ports:          9300/TCP, 9200/TCP
    Host Ports:     0/TCP, 0/TCP
    State:          Running
      Started:      Fri, 13 Dec 2019 09:02:44 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      memory:  2Gi
    Requests:
      cpu:      200m
      memory:   2Gi
```


To view the Kibana dashboard, determine the route:

```
$ oc get route -n openshift-logging

NAME     HOST/PORT                                             PATH   SERVICES   PORT    TERMINATION          WILDCARD
kibana   kibana-openshift-logging.apps.ocpproxy.hpecloud.org          kibana     <all>   reencrypt/Redirect   None
```


In your browser, log in and view the Kibana dashboard using the returned route, in this case,
`https://kibana-openshift-logging.apps.ocpproxy.hpecloud.org`.

![" "][media-simplivity-kibana-efk-hostname-png] 

**Figure. Kibana dashboard**


## Migrating from the small to the large profile

It is possible to expand this initial `small` profile to the `large` profile using the same playbook. You will need to add
extra worker nodes that have the capacity to accept the larger workload. You can add the new nodes before or after you use
the playbook to do the migration, as the result will be the same. In the following example, the playbook is run before the
addition of new nodes, for illustration purposes.

Re-run the playbook, but this time specify the `large` profile. As an alternative to updating your configuration file,
you can set the value on the command line:

```
$ ansible-playbook -i hosts playbooks/efk.yml -e efk_profile=large
```

Notice how there are now 2 Elasticsearch pods in the `pending` state as the Kubernetes scheduler cannot find any nodes
that can fulfil the larger minimum requirements (16 GB memory) for the new Elasticsearch pods.

```
$ kubectl get pod -n openshift-logging
NAME                                            READY   STATUS      RESTARTS   AGE
cluster-logging-operator-789f86bc5d-52864       1/1     Running     0          22m
curator-1576246800-fbwph                        0/1     Completed   0          3m25s
elasticsearch-cdm-98n13kgt-1-68c7c496b7-7h58d   2/2     Running     0          22m
elasticsearch-cdm-98n13kgt-2-77b48d47dd-kszvv   0/2     Pending     0          4m39s
elasticsearch-cdm-98n13kgt-3-ff8844764-2pjcd    0/2     Pending     0          4m38s
fluentd-4xxjm                                   1/1     Running     0          22m
fluentd-ds6v7                                   1/1     Running     0          22m
fluentd-gp6mn                                   1/1     Running     0          22m
fluentd-mv29x                                   1/1     Running     0          22m
fluentd-pnpgj                                   1/1     Running     0          22m
fluentd-sfkcl                                   1/1     Running     0          22m
kibana-6db8448b8c-ff8m7                         2/2     Running     0          4m39s
kibana-6db8448b8c-whlfc                         2/2     Running     0          22m
```

You can use the `oc describe pod` command to determine that the new Elasticsearch pods cannot be scheduled due to
the larger memory requirements:

```
$ oc describe pod elasticsearch-cdm-98n13kgt-2-77b48d47dd-kszvv -n openshift-logging | tail

QoS Class:       Burstable
Node-Selectors:  kubernetes.io/os=linux
Tolerations:     node.kubernetes.io/disk-pressure:NoSchedule
                 node.kubernetes.io/memory-pressure:NoSchedule
                 node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason            Age                  From               Message
  ----     ------            ----                 ----               -------
  Warning  FailedScheduling  82s (x5 over 3m59s)  default-scheduler  0/5 nodes are available: 5 Insufficient memory.
```


Now add extra worker nodes to your cluster, setting the `cpu` and `ram` attributes to sufficiently large values. 
In your hosts file, add new entries in the `[rhcos_worker]` group:

```
[rhcos_worker]
...
hpe-worker5   ansible_host=10.15.155.215  cpus=8 ram=32768  # Larger worker node for EFK
hpe-worker6   ansible_host=10.15.155.216  cpus=8 ram=32768  # Larger worker node for EFK
hpe-worker7   ansible_host=10.15.155.217  cpus=8 ram=32768  # Larger worker node for EFK
```

In the above example, each of these large CoreOS worker nodes will be allocated 8 virtual CPU cores and 32GB of RAM.
These values override the default limits of 4 virtual CPU cores and 16GB RAM defined in the `group_vars/worker.yml` file.

Deploy the additional, large worker nodes using the procedure described in the section [Deploying CoreOS worker nodes](../worker-nodes/coreos).

```
$ ansible-playbook -i hosts playbooks/scale.yml
```

Check that the new nodes are ready, in this case `ocpp-worker5`, `ocpp-worker6` and `ocpp-worker7`.

```
$ oc get nodes

NAME           STATUSS    AGE     VERSION
ocpp-master0   Ready    master   30h     v1.14.6+31a56cf75
ocpp-master1   Ready    master   30h     v1.14.6+31a56cf75
ocpp-master2   Ready    master   30h     v1.14.6+31a56cf75
ocpp-worker0   Ready    worker   30h     v1.14.6+31a56cf75
ocpp-worker1   Ready    worker   30h     v1.14.6+31a56cf75
ocpp-worker2   Ready    worker   30h     v1.14.6+31a56cf75
ocpp-worker5   Ready    worker   1m      v1.14.6+31a56cf75
ocpp-worker6   Ready    worker   1m      v1.14.6+31a56cf75
ocpp-worker7   Ready    worker   1m      v1.14.6+31a56cf75
```


Once the pods are ready, check  how the Elasticsearch pods are distributed across the new nodes:

```
$ kubectl get pod -n openshift-logging -o custom-columns='Name:{.metadata.name},Node:{.spec.nodeName}'

Name                                            Node
cluster-logging-operator-789f86bc5d-52864       ocpp-worker2
curator-1576248600-cscbg                        ocpp-worker7
elasticsearch-cdm-98n13kgt-1-59477757c4-v8cxc   ocpp-worker7
elasticsearch-cdm-98n13kgt-2-77b48d47dd-kszvv   ocpp-worker5
elasticsearch-cdm-98n13kgt-3-ff8844764-2pjcd    ocpp-worker6
fluentd-4xxjm                                   ocpp-master1
fluentd-ds6v7                                   ocpp-worker2
fluentd-gp6mn                                   ocpp-master2
fluentd-lggqs                                   ocpp-worker5
fluentd-mv29x                                   ocpp-master0
fluentd-pnpgj                                   ocpp-worker1
fluentd-r2s4l                                   ocpp-worker7
fluentd-sfkcl                                   ocpp-worker0
fluentd-zztmq                                   ocpp-worker6
kibana-6db8448b8c-ff8m7                         ocpp-worker0
kibana-6db8448b8c-whlfc                         ocpp-worker2
```

The two pending Elasticsearch pods have been scheduled on two of the new larger nodes, `ocpp-worker5` and `ocpp-worker6`. The original Elasticsearch pod is terminated and restarted on the third of the larger nodes, `ocpp-worker7`.

If you now examine the Elasticsearch pod on  `ocpp-worker7`, you will see that the minimum and maximum
resource requirements have changed, as shown in the `Requests` and `Limits` fields:

```
$ oc describe pod elasticsearch-cdm-98n13kgt-1-59477757c4-m8m5w -n openshift-logging                                  Name:               elasticsearch-cdm-98n13kgt-1-59477757c4-m8m5w

Namespace:          openshift-logging
Priority:           0
PriorityClassName:  <none>
Node:               ocpp-worker7/10.15.163.220
Start Time:         Fri, 13 Dec 2019 10:04:13 -0500
...
Status:             Running
IP:                 10.130.2.7
Controlled By:      ReplicaSet/elasticsearch-cdm-98n13kgt-1-59477757c4
Containers:
  elasticsearch:
    Container ID:   cri-o://42e8169e2c2bd3acbd2b059a12ee33f2fb85a42eb15d36a4a2faf6c6ab13ef3d
    Image:          registry.redhat.io/openshift4/ose-logging-elasticsearch5@sha256:ddcead06ec96b837804f8299d6cbd6ba33e46c9555cdc96a7aba8c820f9bd29f
    Image ID:       registry.redhat.io/openshift4/ose-logging-elasticsearch5@sha256:ddcead06ec96b837804f8299d6cbd6ba33e46c9555cdc96a7aba8c820f9bd29f
    Ports:          9300/TCP, 9200/TCP
    Host Ports:     0/TCP, 0/TCP
    State:          Running
      Started:      Fri, 13 Dec 2019 10:04:38 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      memory:  16Gi
    Requests:
      cpu:      1
      memory:   16Gi
```



[media-simplivity-kibana-efk-hostname-png]:<../images/kibana-efk-hostname.png> "Figure.  Kibana dashboard"