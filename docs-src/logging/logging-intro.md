# Introduction to cluster logging

You can deploy cluster logging to aggregate logs for a range of OpenShift Container Platform services.

The built-in cluster logging components are based upon Elasticsearch, Fluentd, and Kibana (EFK). The collector, Fluentd, is deployed to each node in the OpenShift Container Platform cluster. It collects all node and container logs and writes them to Elasticsearch (ES). Kibana is the centralized, web UI where users and administrators can create rich visualizations and dashboards with the aggregated data.

## About cluster logging components
There are four different types of cluster logging components:

- `logStore`: This is where the logs will be stored. The current implementation is `Elasticsearch`.
- `collection`: This is the component that collects logs from the node, formats them, and stores them in the logStore. The current implementation is `Fluentd`.
- `visualization`: This is the UI component used to view logs, graphs, charts, and so forth. The current implementation is `Kibana`.
- `curation`: This is the component that trims logs by age. The current implementation is `Curator`.

For more information about the OpenShift Cluster Logging facility, refer to the documentation at
[https://docs.openshift.com/container-platform/4.2/logging/cluster-logging.html](https://docs.openshift.com/container-platform/4.2/logging/cluster-logging.html).

## Multiple profiles

Elasticsearch is a memory-intensive application and in a production environment, each instance could require up to 64GB of memory. As a result, the playbooks support two distinct profiles for cluster logging deployment:

- `small`  suitable for proof of concept deployments, deploying a single instance of Elasticsearch with 2GB memory and minimal vCPU (200m).
- `large` suitable for production and deploying three Elasticsearch pods, each requiring a minimum of 16GB and 1 vCPU, and two Kibana replicas. For production use, you should have no less than 16GB allocated to each Elasticsearch pod by default, but preferably allocate as much as you can, up to 64GB per pod.

