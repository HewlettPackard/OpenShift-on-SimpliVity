# Configuring cluster logging

The playbooks support two distinct profiles for cluster logging deployment, `small` and `large`.  The profile is
determined by the variable `efk_profile` in the configuration file `group_vars/all/vars.yml`. If you do not specify
any value, the `small` profile will be deployed by default. You can also use the playbooks to migrate from
a `small` profile to a `large` profile.

The playbooks support the deployment of different versions of the EFK stack, based on the value of the variable
`efk_channel`.
To deploy the current OCP 4.2 stack, you must set the `efk_channel` variable to `4.2`.
If you want to use the legacy OCP 4.1 version of the stack on an OCP 4.1 cluster, set the `efk_channel`
variable to `preview`. Note that you cannot use the `preview` channel on an OCP 4.2 cluster.

You can configure a persistent storage class and size for the Elasticsearch cluster. The Cluster Logging Operator creates
a PersistentVolumeClaim for each data node in the Elasticsearch cluster based on the relevant parameters in your
configuration file.

## Configuration variables

The variables for configuring cluster logging are described in the following table:


|Variable|File|Description|
|:-------|:---|:----------|
|`efk_channel`|group_vars/all/vars.yml|This required variable determines the version of the EFK stack deployed. For OCP 4.2, set this value to `4.2`. For OCP 4.1, this *must* be set to `preview`. Note that `preview` channel will not work on OCP 4.2.|
|`efk_profile`|group_vars/all/vars.yml|Determines the profile used when deploying the EFK stack.<br><br>`small` suitable for proof of concept deployments, deploying a single instance of Elasticsearch and Kibana,  requiring 2 GB memory and minimal vCPU (200m)<br><br>`large` suitable for a production environment, deploying three Elasticsearch pods, each requiring a minimum of 16GB and 1 vCPU, and 2 Kibana instances<br><br>Defaults to `small`|
|`efk_es_pv_size`|group_vars/all/vars.yml|Size of the Persistent Volume used to hold Elasticsearch data. The default size is `'200G'`.|
|`efk_es_pv_storage_class`|group_vars/all/vars.yml|The Storage Class to use when creating Elasticsearch Persistent Volumes. The default storage class name is `'thin'`.|

