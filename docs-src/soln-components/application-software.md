# Application software


## Prometheus and Grafana

OpenShift Container Platform includes a pre-configured, pre-installed, and self-updating monitoring stack that is based
on the Prometheus open source project and its wider eco-system. It provides monitoring of cluster components and includes
a set of alerts to immediately notify the cluster administrator about any occurring problems, as well as a set of Grafana
dashboards. The cluster monitoring stack is only supported for monitoring OpenShift Container Platform clusters. If you
wish to monitor your own application workloads, you should deploy a separate Prometheus instance.

All the components of the monitoring stack are monitored by the stack and are automatically updated when OpenShift Container Platform is updated.

The monitoring stack also monitors cluster components including:

- etcd
- Kubernetes apiserver, controller manager, scheduler
- OpenShift apiserver, controller manager, Lifecycle Manager
- CoreDNS and HAProxy
- Image registry
- Elasticsearch and Fluentd (if cluster logging is installed)

For more information about the monitoring stack, see the documentation at [https://docs.openshift.com/container-platform/4.2/monitoring/cluster-monitoring/about-cluster-monitoring.html](https://docs.openshift.com/container-platform/4.2/monitoring/cluster-monitoring/about-cluster-monitoring.html).


## Elasticsearch, Fluentd and Kibana

 HPE provides an additional playbook to deploy the integrated cluster logging stack, which aggregates logs for a range of OpenShift Container Platform services.

The cluster logging components are based upon Elasticsearch, Fluentd, and Kibana (EFK). The collector, Fluentd, is
deployed to each node in the OpenShift Container Platform cluster. It collects all node and container logs and writes
them to Elasticsearch (ES). Kibana is the centralized, web UI where users and administrators can create rich
visualizations and dashboards with the aggregated data.


### Fluentd

OpenShift Container Platform uses Fluentd to collect data about your cluster. Fluentd is deployed as a DaemonSet in
OpenShift Container Platform, which deploys pods to each OpenShift Container Platform node. Fluentd uses journald as the
system log source. These are log messages from the operating system, the container runtime, and OpenShift Container
Platform.


### Elasticsearch

OpenShift Container Platform uses Elasticsearch (ES) to organize the log data from Fluentd into datastores, or indices.
Elasticsearch subdivides each index into multiple pieces called shards, which it spreads across a set of Elasticsearch
nodes in an Elasticsearch cluster. You can configure Elasticsearch to make copies of the shards, called replicas.
Elasticsearch also spreads these replicas across the Elasticsearch nodes.

### Kibana

OpenShift Container Platform uses Kibana to display the log data collected by Fluentd and indexed by Elasticsearch.
Kibana is a browser-based console interface to query, discover, and visualize your Elasticsearch data through histograms,
line graphs, pie charts, heat maps, built-in geospatial support, and other visualizations.
