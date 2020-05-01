# Persistent storage

Persistent storage is required by a number of cluster components and also may be required by any stateful application workloads running on your cluster. Among the built-in OCP components that can take advantage of persistent storage are:

- Image registry
- Prometheus, part of the monitoring stack
- Elasticsearch and Alertmanager, part of the logging stack

By default, the OpenShift installer configures a default storage class `thin` which uses the vSphere Cloud Provider. 