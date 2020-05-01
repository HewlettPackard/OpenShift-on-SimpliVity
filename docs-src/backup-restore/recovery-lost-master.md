# Recovering from lost master hosts

It is possible to use the etcd backup to recover from the scenario where one or more master nodes have been lost. This includes situations where a majority of master hosts have been lost, leading to etcd quorum loss and the cluster going offline. The following procedure assumes that you have at least one healthy master host.

::: warning
This procedure can be used to validate that your etcd backup has succeeded, but it is highly invasive in that it
requires you to destroy master nodes and would render your cluster unusable for the duration of the procedure.
:::

The information in this section is taken from [https://docs.openshift.com/container-platform/4.2/backup_and_restore/disaster_recovery/scenario-1-infra-recovery.html](https://docs.openshift.com/container-platform/4.2/backup_and_restore/disaster_recovery/scenario-1-infra-recovery.html). Please check the latest version of the OpenShift documentation for any updates to this procedure.


## Prerequisites


- Ensure  that you can access the first master node `ocp-master0` using `ssh`
- Ensure that you have taken a backup, as outlined in the preceding section

    ```bash
    $ ls -al  ~/backups/

    -rw-rw-r--.  1 core core   625040 Sep 22 09:18 backup_2019_09_22_131749.misc.tgz
    -rw-rw-r--.  1 core core 21732338 Sep 22 09:18 backup_2019_09_22_131749.snapshots.tgz
    ```


Unpack the snapshots:
```bash
$ cd ~/backups
$ tar -xvf backup_2019_09_22_131749.snapshots.tgz

ocp-master1/
ocp-master0/
ocp-master2/
ocp-master1/assets/
ocp-master1/assets/backup/
ocp-master1/assets/backup/snapshot.db
ocp-master1/assets/backup/etcd-member.yaml
ocp-master1/assets/backup/etcd-client.key
ocp-master1/assets/backup/etcd-client.crt
ocp-master1/assets/backup/etcd-ca-bundle.crt
ocp-master0/assets/
ocp-master0/assets/backup/
ocp-master0/assets/backup/snapshot.db
ocp-master0/assets/backup/etcd-member.yaml
ocp-master0/assets/backup/etcd-client.key
ocp-master0/assets/backup/etcd-client.crt
ocp-master0/assets/backup/etcd-ca-bundle.crt
ocp-master2/assets/
ocp-master2/assets/backup/
ocp-master2/assets/backup/snapshot.db
ocp-master2/assets/backup/etcd-member.yaml
ocp-master2/assets/backup/etcd-client.key
ocp-master2/assets/backup/etcd-client.crt
ocp-master2/assets/backup/etcd-ca-bundle.crt
```



## Loss of two master nodes


If you lose (or purposely delete) two master nodes, etcd quorum will be lost and this will lead to the cluster going offline. If you the try to run `oc` commands, they will not respond:

```
$ oc get nodes
```

If you view the cluster health in the web console, you will see that the control plane status is unknown.


!["Cluster health"][media-cluster-health-png] 

**Figure. Cluster health**


## Restore etcd quorum on the remaining master


Copy a snapshot from the backup to the remaining master:

```bash
$ scp ~/backups/ocp-master0/assets/backup/snapshot.db core@ocp-master0:~/
```

Connect to the remaining master `ocp-master0`

```bash
$ ssh  ocp-master0

Warning: Permanently added 'ocp-master0,10.15.155.210' (ECDSA) to the list of known hosts.
Red Hat Enterprise Linux CoreOS 410.8.20190830.0
WARNING: Direct SSH access to machines is not recommended.

---
Last login: Sun Sep 22 13:18:33 2019 from 10.15.155.7
[core@ocp-master0 ~]$

```

Set the `INITIAL_CLUSTER` variable to the single remaining member, in the format of `<name>=<url>`. First, 
you need to determine the `name` and `url` to use:


```bash
$ ETCDCTL=/var/home/core/assets/bin/etcdctl
$ ASSET_DIR=/home/core/assets/
$ sudo ETCDCTL_API=3 ${ETCDCTL} --cert $ASSET_DIR/backup/etcd-client.crt --key $ASSET_DIR/backup/etcd-client.key --cacert $ASSET_DIR/backup/etcd-ca-bundle.crt member list

1daf5dbed09ea2d3, started, etcd-member-ocp-master2, https://etcd-2.ocp.hpecloud.org:2380, https://10.15.155.212:2379
333583b05ff2cf8a, started, etcd-member-ocp-master0, https://etcd-0.ocp.hpecloud.org:2380, https://10.15.155.210:2379
4be0034d015274a2, started, etcd-member-ocp-master1, https://etcd-1.ocp.hpecloud.org:2380, https://10.15.155.211:2379
```

Now, set the `INITIAL_CLUSTER` environment variable using the information gathered for `ocp-master0`:

```bash
$ export INITIAL_CLUSTER="etcd-member-ocp-master0.ocp.hpecloud.org=https://etcd-0.ocp.hpecloud.org:2380"
```

Run the `etcd-snapshot-restore.sh` script, using the copied snapshot and the member list, in this case, just the `ocp-master0` member:


```bash
$ sudo /usr/local/bin/etcd-snapshot-restore.sh /home/core/snapshot.db $INITIAL_CLUSTER


Downloading etcdctl binary..
etcdctl version: 3.3.10
API version: 3.3
etcd-member.yaml found in ./assets/backup/
Stopping all static pods..
..stopping etcd-member.yaml
..stopping kube-scheduler-pod.yaml
..stopping kube-controller-manager-pod.yaml
..stopping kube-apiserver-pod.yaml
Stopping etcd..
Waiting for etcd-member to stop
Stopping kubelet..
Stopping all containers..
019708c6aff244dbc47f90cec65c4823a93b8e3fe731f3a5e8f3cdedb0dc37ed
81eed61df3ee87bd960602f23e598ab48b43a6cb5610f4ecfed709f1e1b67119
...
Backing up etcd data-dir..
Removing etcd data-dir /var/lib/etcd
Restoring etcd member etcd-member-ocp-master0.ocp.hpecloud.org from snapshot..
2019-09-22 14:18:21.903011 I | pkg/netutil: resolving etcd-0.ocp.hpecloud.org:2380 to 10.15.155.210:2380
2019-09-22 14:18:22.154363 I | mvcc: restore compact to 713621
2019-09-22 14:18:22.207764 I | etcdserver/membership: added member 1c5a549c9f4e67b5 [https://etcd-0.ocp.hpecloud.org:2380] to cluster 11eeb64feb9a2071
Starting static pods..
..starting etcd-member.yaml
..starting kube-scheduler-pod.yaml
..starting kube-controller-manager-pod.yaml
..starting kube-apiserver-pod.yaml
Starting kubelet..
```

On your Ansible controller node, check the nodes in your cluster:

```bash
$ oc get nodes

NAME          STATUS     ROLES    AGE   VERSION
ocp-master0   Ready      master   45h   v1.14.6+31a56cf75
ocp-master1   NotReady   master   45h   v1.14.6+31a56cf75
ocp-master2   NotReady   master   45h   v1.14.6+31a56cf75
ocp-worker0   Ready      worker   45h   v1.14.6+31a56cf75
ocp-worker1   Ready      worker   45h   v1.14.6+31a56cf75
```

You need to explicitly delete the `NotReady` nodes `ocp-master1` and `ocp-master2`:

```bash
$ oc delete node ocp-master1
$ oc delete node ocp-master2

$ oc get nodes

NAME          STATUS   ROLES    AGE   VERSION
ocp-master0   Ready    master   45h   v1.14.6+31a56cf75
ocp-worker0   Ready    worker   45h   v1.14.6+31a56cf75
ocp-worker1   Ready    worker   45h   v1.14.6+31a56cf75
```

## Redeploy the two master nodes

You need to re-build the nodes for `ocp-master1` and `ocp-master2`. You must ensure that your `/etc/hosts`, DNS, and load balancers are modified appropriately.



## Grow etcd to full membership.

Set up a temporary etcd certificate signer service on your master node that is an etcd member, in this case, `ocp-master0`. Connect to the master node and then log in to your cluster as a `cluster-admin` user using the following command:

```bash
$ oc login https://localhost:6443

The server uses a certificate signed by an unknown authority.
You can bypass the certificate check, but any data you send to the server could be intercepted by others.
Use insecure connections? (y/n): y

Authentication required for https://localhost:6443 (openshift)
Username: kubeadmin
Password:  LX65K-DXmpC-P4Hpo-W35au
Login successful.
```

Obtain the pull specification for the `kube-etcd-signer-server` image:

```bash
$ export KUBE_ETCD_SIGNER_SERVER=$(sudo oc adm release info --image-for kube-etcd-signer-server --registry-config=/var/lib/kubelet/config.json --config=/home/core/.kube/config)
```


Run the `tokenize-signer.sh` script to generate the required files:

```bash
$ sudo -E /usr/local/bin/tokenize-signer.sh ocp-master0

Populating template /usr/local/share/openshift-recovery/template/kube-etcd-cert-signer.yaml.template
Populating template ./assets/tmp/kube-etcd-cert-signer.yaml.stage1
Tokenized template now ready: ./assets/manifests/kube-etcd-cert-signer.yaml
```

Use the generated `kube-etcd-cert-signer.yaml` file to deploy the signer pod:

```bash
$ oc create -f assets/manifests/kube-etcd-cert-signer.yaml

pod/etcd-signer created
```

Verify that the signer is listening on this master node - it may take a minute or two to start.

```bash
$ ss -ltn | grep 9943
$ ss -ltn | grep 9943

LISTEN   0         128                       *:9943                   *:*
```

## Add the restored master hosts to the etcd cluster

Connect to one of the restored master nodes, in this case, `ocp-master1`:

```bash
$ ssh ocp-master1
```

Log in to your cluster as a cluster-admin user using the following command:

```bash
$ oc login https://localhost:6443

The server uses a certificate signed by an unknown authority.
You can bypass the certificate check, but any data you send to the server could be intercepted by others.
Use insecure connections? (y/n): y

Authentication required for https://localhost:6443 (openshift)
Username: kubeadmin
Password:  LX65K-DXmpC-P4Hpo-W35au
Login successful.

```

Export two environment variables that are required by the etcd-member-recover.sh script:

```bash
$ export SETUP_ETCD_ENVIRONMENT=$(sudo oc adm release info --image-for setup-etcd-environment --registry-config=/var/lib/kubelet/config.json  --config=/home/core/.kube/config)

$ export KUBE_CLIENT_AGENT=$(sudo oc adm release info --image-for kube-client-agent --registry-config=/var/lib/kubelet/config.json --config=/home/core/.kube/config)
```


Run the `etcd-member-recover.sh` script, passing in that IP address of `ocp-master0` and the name of the new etcd member:

```bash
$ sudo -E /usr/local/bin/etcd-member-recover.sh 10.15.155.210 etcd-member-ocp-master1.ocp.hpecloud.org

Creating asset directory ./assets
Downloading etcdctl binary..
etcdctl version: 3.3.10
API version: 3.3
Backing up /etc/kubernetes/manifests/etcd-member.yaml to ./assets/backup/
Backing up /etc/etcd/etcd.conf to ./assets/backup/
Trying to backup etcd client certs..
etcd client certs found in /etc/kubernetes/static-pod-resources/kube-apiserver-pod-8 backing up to ./assets/backup/
Stopping etcd..
Waiting for etcd-member to stop
Waiting for etcd-member to stop
Waiting for etcd-member to stop
Waiting for etcd-member to stop
Local etcd snapshot file not found, backup skipped..
Backing up etcd certificates..
Populating template /usr/local/share/openshift-recovery/template/etcd-generate-certs.yaml.template
Populating template ./assets/tmp/etcd-generate-certs.stage1
Populating template ./assets/tmp/etcd-generate-certs.stage2
Starting etcd client cert recovery agent..
Waiting for certs to generate..
Waiting for certs to generate..
Waiting for certs to generate..
Waiting for certs to generate..
Stopping cert recover..
Waiting for generate-certs to stop
Patching etcd-member manifest..
Updating etcd membership..
Member 81d77724154f987e added to cluster 11eeb64feb9a2071

ETCD_NAME="etcd-member-ocp-master1.ocp.hpecloud.org"
ETCD_INITIAL_CLUSTER="etcd-member-ocp-master0=https://etcd-0.ocp.hpecloud.org:2380,etcd-member-ocp-master1.ocp.hpecloud.org=https://etcd-1.ocp.hpecloud.org:2380"
ETCD_INITIAL_ADVERTISE_PEER_URLS="https://etcd-1.ocp.hpecloud.org:2380"
ETCD_INITIAL_CLUSTER_STATE="existing"
Starting etcd..
```

## Verify master host has been added to the etcd member list

From your Ansible controller node, connect to the first master `ocp-master1`:

```bash
# ssh ocp-master0
```

Connect to the running etcd container:

```
$ id=$(sudo crictl ps --name etcd-member | awk 'FNR==2{ print $1}')
$ sudo crictl exec -it $id /bin/sh

sh-4.2#
```

In the etcd container, export variables needed for connecting to etcd:

```
sh-4.2# export ETCDCTL_API=3 
sh-4.2# export ETCDCTL_CACERT=/etc/ssl/etcd/ca.crt 
sh-4.2# export ETCDCTL_CERT=$(find /etc/ssl/ -name *peer*crt)                   
sh-4.2# export ETCDCTL_KEY=$(find /etc/ssl/ -name *peer*key)
```



In the etcd container, execute `etcdctl member list` and verify that the new member is listed:

```
sh-4.2# etcdctl member list -w table
+------------------+---------+------------------------------------------+--------------------------------------+                               ----------------------------+
|        ID        | STATUS  |                   NAME                   |              PEER ADDRS              |                                       CLIENT ADDRS        |
+------------------+---------+------------------------------------------+--------------------------------------+                               ----------------------------+
| 1c5a549c9f4e67b5 | started |                  etcd-member-ocp-master0 | https://etcd-0.ocp.hpecloud.org:2380 |                                https://10.15.155.210:2379 |
| 81d77724154f987e | started | etcd-member-ocp-master1.ocp.hpecloud.org | https://etcd-1.ocp.hpecloud.org:2380 |                                https://10.15.155.211:2379 |
+------------------+---------+------------------------------------------+--------------------------------------+                               ----------------------------+
sh-4.2#
```

Note that it may take up to 10 minutes for the new member to start. Repeat these steps for `ocp-master2` until 
you have achieved full etcd membership.

When you are finished restoring the etcd cluster, delete the signer pod from the OpenShift cluster:

```bash
$ oc delete pod -n openshift-config etcd-signer
```


[media-cluster-health-png]:<../images/cluster-health.png> "Figure. Cluster health"

