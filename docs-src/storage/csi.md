# Container Storage Interface (CSI) driver

When deploying this solution, the vSphere Cloud Provider legacy storage plugin is installed by default.
If you are running version 6.7 U3 of VMware ESX, you can use the playbooks to take advantage of the new support
for the Container Storage Interface (CSI) plugin.

The playbook `playbook/csi.yml` codifies the instructions for manually installing the vSphere Container Storage Interface 
driver that are available at
[https://docs.vmware.com/en/VMware-vSphere/6.7/Cloud-Native-Storage/GUID-039425C1-597F-46FF-8BAA-C5A46FF10E63.html](https://docs.vmware.com/en/VMware-vSphere/6.7/Cloud-Native-Storage/GUID-039425C1-597F-46FF-8BAA-C5A46FF10E63.html).


Without configuration, the playbook will use an existing datastore for the persistent CSI volumes, specifically the
first datastore in the Ansible variable `datastores`. If you want the playbook to automatically provision a separate
datastore for CSI, you must follow the relevant instructions in the section on
[HPE SimpliVity configuration](../config-core/simplivity-config). In particular, you need to
identify the IP address of the OmniStack appliance(s) in your HPE SimpliVity cluster, using the variable
`simplivity_appliances`.



## Configuration variables for CSI

The variables related to CSI configuration are described in the table below.

|Variable|File|Description|
|:-------|:---|:----------|
|`csi_datastore_name`|group_vars/all/vars.yml|The name of the datastore which will hold the persistent volumes. If this variable is not configured, the first datastore listed in the Ansible variable `datastores` is used.|
|`csi_datastore_size`|group_vars/all/vars.yml|Optional size of CSI datastore, specified in GB. Defaults to 512 GB. If an existing datastore is used for CSI persistent volumes, this variable is ignored.|
|`csi_storageclass_name`|group_vars/all/vars.yml|Name of the storage class to be created. If a storage class already exists with this name, it will remain unmodified. If no value is specified for this variable, a storage class named `csivols` will be created, provided one with this name does not already exist.|

While it is possible to use an exising datastore, it is recommended that you create a dedicated one for CSI volumes, either manually or using the automated provisioning.


## Running the playbook

Before running the playbook, you should log in as an admin user (either `kubeadmin` or
any other user that has the `cluster_admin` role):

```
$ export KUBECONFIG ~/.ocp/auth/kubeconfig
$ oc login -u kubeadmin -p <password>
$ cd ~/OpenShift-on-SimpliVity
```

Once you have configured the appropriate variables, run the playbook:

```
$ ansible-playbook -i hosts playbooks/csi.yml
```

Once the playbook has finished, you can check that the CSI pods are operational and that storage class has been created. 

```
oc get pods -n kube-system

NAME                       READY   STATUS    RESTARTS   AGE
vsphere-csi-controller-0   5/5     Running   0          90m
vsphere-csi-node-9b4sf     3/3     Running   0          90m
vsphere-csi-node-dqht2     3/3     Running   0          90m
```

Assuming the following configuration:

```
csi_datastore_name: "OCP_CSI_DATASTORE"
csi_datastore_size: 200
csi_storageclass_name: "ocp-csi-sc"
```

You should check that the appropriate storage class named `ocp-csi-sc` has been created:

```
$ oc get sc

NAME             PROVISIONER                    AGE
ocp-csi-sc       csi.vsphere.vmware.com         26m
thin (default)   kubernetes.io/vsphere-volume   5h39m
```

In VMware vCenter UI, you can see that the datastore has been created with the correct size:


![" "][media-simplivity-csi-datastore-png] 

**Figure. CSI datastore**


## Further information

General information on CSI in Kubernetes is available at
[https://kubernetes-csi.github.io/docs/](https://kubernetes-csi.github.io/docs/).

Information on the VMware CSI driver is at
[https://github.com/kubernetes-sigs/vsphere-csi-driver](https://github.com/kubernetes-sigs/vsphere-csi-driver).

Documentation on using CSI in OpenShift is available at
[https://docs.openshift.com/container-platform/4.2/storage/persistent-storage/persistent-storage-csi.html](https://docs.openshift.com/container-platform/4.2/storage/persistent-storage/persistent-storage-csi.html).

[media-simplivity-csi-datastore-png]:<../images/csi-datastore.png> "Figure.  CSI datastore"

