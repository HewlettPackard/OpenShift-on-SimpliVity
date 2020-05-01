# Validating the cluster logging deployment

To verify the cluster logging deployment, in the web console:

- Switch to the `Workloads` -> `Pods` page
- Select the `openshift-logging` project

You should see several pods for cluster logging, Elasticsearch, Fluentd, and Kibana similar to the following list:

```
cluster-logging-operator-cb795f8dc-xkckc
elasticsearch-cdm-b3nqzchd-1-5c6797-67kfz
elasticsearch-cdm-b3nqzchd-2-6657f4-wtprv
elasticsearch-cdm-b3nqzchd-3-588c65-clg7g
fluentd-2c7dg
fluentd-9z7kk
fluentd-br7r2
fluentd-fn2sb
fluentd-pb2f8
fluentd-zqgqx
kibana-7fb4fd4cc9-bvt4p
kibana-7fb4fd4cc9-st4cs
```

Alternatively, you can use the `oc` client instead:

```
# oc get pod -n openshift-logging
```

## Access the Kibana Dashboard

Once the Cluster Logging instance has deployed successfully a new entry called `Logging` will appear under the
`Monitoring` tab of the OpenShift Container Platform dashboard. Selecting the Logging entry will launch the 
Kibana Dashboard in a separate browser tab.

The Kibana dashboard can also be accessed directly at: 
```
https://kibana-openshift-logging.apps.<<cluster_name>>.<<domain_name>>
```
 where `<<cluster_name>>` and `<<domain_name>>` match the `cluster_name` and `domain_name` variables configured in the `group_vars/all/vars.yml` file.


