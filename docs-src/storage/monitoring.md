# Cluster monitoring

 You can configure persistent storage for the cluster monitoring components using the Ansible playbook
 `playbooks/monitoring.yml`. This playbook automates the configuration of persistent storage for the Prometheus
 and Alertmanager pods.

A separate storage volume is created for each Prometheus and Alertmanager pod. On the OpenShift Container Platform,
this is achieved using persistent volume claims (PVC) and persistent volumes (PV). You can customize both the storage
class and the size of the persistent volumes used to store Prometheus and Alertmanager data by editing the
following variables in the file `playbooks/roles/monitoring/vars/main.yml`:


|Variable|Description|
|:-------|:----------|
| prometheus_pv_size|Size of the persistent volume used to hold Prometheus data (default size is `'40Gi'`)|
| prometheus_pv_storage_class|The storage class to use when creating Prometheus persistent volumes (default storage class name is `'thin'`) |
| alertmanager_pv_size|Size of the persistent volume used to hold Alertmanager data (default size is `'40Gi'`) |
| alertmanager_pv_storage_class|The storage class to use when creating Alertmanager persistent volumes (default storage class name is `'thin'`) |

After making the appropriate customizations to the above variables, re-deploy the  cluster monitoring components by changing into the directory where you cloned the OpenShift-on-SimpliVity repository and running the appropriate playbook:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/monitoring.yml
```

The playbook takes approximately 1-2 minutes to complete.  However, it may take some additional time for the various cluster monitoring components to successfully re-launch with their newly created persistent storage volumes:

```
$ oc get pvc -n openshift-monitoring

NAME                                     STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
alertmanager-claim-alertmanager-main-0   Bound    pvc-3ec286d3-0d3b-11ea-9074-00505681c3ee   40Gi       RWO            thin           2m23s
alertmanager-claim-alertmanager-main-1   Bound    pvc-3ec845dd-0d3b-11ea-9074-00505681c3ee   40Gi       RWO            thin           2m23s
alertmanager-claim-alertmanager-main-2   Bound    pvc-3ed13223-0d3b-11ea-9074-00505681c3ee   40Gi       RWO            thin           2m23s
prometheus-claim-prometheus-k8s-0        Bound    pvc-3ee82db4-0d3b-11ea-9074-00505681c3ee   40Gi       RWO            thin           2m23s
prometheus-claim-prometheus-k8s-1        Bound    pvc-3ef1c00a-0d3b-11ea-9074-00505681c3ee   40Gi       RWO            thin           2m23s
```

