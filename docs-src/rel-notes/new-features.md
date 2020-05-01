# New features in this release

This release of the Reference Configuration for Red Hat OpenShift Container Platform (OCP) on HPE SimpliVity
supports version 4.2 of the OpenShift Container Platform (OCP).

## Container Storage Interface (CSI)

Originally, volume plugins were required to be implemented as part of the core Kubernetes codebase (in-tree).
The Container Storage Interface (CSI) is a standard for exposing arbitrary block and file storage systems to containerized
workloads on container orchestration systems like Kubernetes. Using CSI, third-party storage providers can write and
deploy plugins exposing new storage systems in Kubernetes without ever having to touch the core Kubernetes code.

One of the goals of Kubernetes CSI is to make implementations transparent to users by leveraging the existing internal
volume controller mechanism. This allows Kubernetes to drive CSI-backed operations such as dynamic provisioning, attachment,
and mounting using existing primitives such as StorageClasses, PersistentVolumeClaims, and PersistentVolumes.

Support for Container Storage Interface (CSI) is now available in OpenShift Container Platform 4.2.

For more information, see the section on [Container Storage Interface](../storage/csi).

## Sysdig

You can use the playbook `playbooks/sysdig.yml` to integrate your cluster with Sysdig. The implementation in this solution uses the Software as a Service (SaaS) version of Sysdig at `app.sysdigcloud.com`. The playbook deploys the Sysdig Agent software on all OpenShift node, with captured data relayed back to your Sysdig SaaS Cloud portal.

For more information, see the section on [Sysdig Integration](../post-deploy/sysdig).


## Installation behind proxy

OpenShift Container Platform 4.2 introduces support for installing and updating an OpenShift Container Platform cluster through a corporate proxy server on user-provisioned infrastructure (UPI). Proxy information (`httpProxy`, `httpsProxy`, and `noProxy`) can be defined and used during the installation process and can also be managed post-installation via the cluster Proxy object.

For more information, see the section on [Proxy configuration](../config-core/proxy-config).

## Cluster logging changes

The solution now supports two distinct profiles for deploying cluster logging. The `small` profile deploys a single instance of Elasticsearch and a single instance of Kibana, with reduced CPU and memory requirements. This is useful for proof of concept deployments, where there may be limited resources and no need for redundancy. In contrast, the `large` profile can be used to deploy a highly available, production-ready instance of cluster logging.

For more information, see the section on [Cluster logging](../logging/logging-intro).

## Automatic provisioning of datastores

It is now possible to take advantage of functionality that is specific to HPE SimpliVity to automatically provision
datastores.

For more information, see the section on [HPE SimpliVity configuration](../config-core/simplivity-config).

## Cluster verification

After the OCP cluster is sucessfully deployed using `site.yml`, a final cluster verification playbook is run to execute additional verification tasks.

For more information, see the section on [Cluster verification](../post-deploy/cluster-verification).