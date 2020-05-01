# About this release

This release has been tested using Red Hat OpenShift Container Platform (OCP) 4.2.9, which is based on Kubernetes 1.14.

## Red Hat OpenShift Container Platform 4.2

New features in Red Hat OpenShift Container Platform 4.2 include:

- **Kubernetes 1.14 with CRI-O:** CRI-O is a light weight, kubernetes-native, OCI-compatible container runtime that is life-cycled and managed by OpenShift Container Platform.
- **CSI support:** Container Storage Interface (CSI) is now available
- **Proxy support:** Support for installing and updating an OpenShift Container Platform cluster through a corporate proxy server on user-provisioned infrastructure.
- **Improved developer experience:** OpenShift Do (odo) is a CLI tool for developers to create, build, and deploy applications on OpenShift while CodeReady Containers provide developers with a minimal environment for development and testing purposes.
- **Service mesh:** Red Hat OpenShift Service Mesh provides a platform for behavioral insight and operational control over your networked microservices in a service mesh. With Red Hat OpenShift Service Mesh, you can connect, secure, and monitor microservices in your OpenShift Container Platform environment. See the documentation at [https://docs.openshift.com/container-platform/4.2/service_mesh/service_mesh_arch/understanding-ossm.html](https://docs.openshift.com/container-platform/4.2/service_mesh/service_mesh_arch/understanding-ossm.html).




OpenShift Container Platform 4.2 supports Red Hat Enterprise Linux (RHEL) 7.6, as well as Red Hat
Enterprise Linux CoreOS (RHCOS) 4.2. You must use CoreOS  for the master control plane machines and
can use either CoreOS or RHEL 7.6 for worker compute machines. Two CoreOS worker nodes are required for the
initial deployment of the cluster, but these can be replaced subsequently with RHEL nodes if required. Because
version 7.6 of Red Hat Enterprise Linux is the only non-RHCOS version of Red Hat Enterprise Linux supported
for compute machines, you must not upgrade these RHEL compute machines to version 8.

See the Red Hat OCP 4.2 release notes at [https://docs.openshift.com/container-platform/4.2/release_notes/ocp-4-2-release-notes.html](https://docs.openshift.com/container-platform/4.2/release_notes/ocp-4-2-release-notes.html)


## VMware

If you want to use the VMware Container Storage Interface (CSI) plugin, you must install the OpenShift Container Platform cluster on a VMware vSphere instance running version 6.7U3 or later. Otherwise, a VMware vSphere version 6.5 or 6.7U2 or later instance is required.

This release has been tested on VMware vSphere version 6.7U3 and on version 6.7U2.


## Ansible

Ansible version `2.8.5` or later is required (for the Red Hat `openshift-ansible` playbooks that are
used to scale RHEL nodes). Note that you should not use Ansible version `2.9.1` as there is a known issue with
this release that prevents the playbooks from operating successfully.





