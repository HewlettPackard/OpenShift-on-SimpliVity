# OpenShift artifacts


## Documentation

### Architecture
An introduction to the OpenShift Container Platform architecture is available at
[https://docs.openshift.com/container-platform/4.2/architecture/architecture.html](https://docs.openshift.com/container-platform/4.2/architecture/architecture.html)


### Installation

OpenShift Container Platform supports two types of installation scenarios:

- Installer-Provisioned Infrastructure (IPI) where the installation program is responsible for deploying and maintaining the underlying infrastructure, as well as the cluster itself. An example of this is the deployment to Amazon Web Services (AWS).
- User-Provisioned Infrastructure (UPI) where the user is responsible for setting up and maintaining the underlying infrastructure, and the installation program  deploys the cluster on top of this. An example of this style of installation is deployment to bare metal or to VMware vSphere.

As this solution runs on HPE SimpliVity, it follows the methodology for User-Provisioned Infrastructure, and it 
helps you to deploy the underlying VMs for the cluster itself and for supporting machines.

More information on the general installation process is available at
[https://docs.openshift.com/container-platform/4.2/architecture/architecture-installation.html](https://docs.openshift.com/container-platform/4.2/architecture/architecture-installation.html)

Documentation specific to installation on a vSphere cluster is at
[https://docs.openshift.com/container-platform/4.2/installing/installing_vsphere/installing-vsphere.html](https://docs.openshift.com/container-platform/4.2/installing/installing_vsphere/installing-vsphere.html)


### Release notes

OpenShift Container Platform provides regular updates, so it is important to follow the release
details provided and to upgrade regularly. The OpenShift release notes for 4.2 are available at
[https://docs.openshift.com/container-platform/4.2/release_notes/ocp-4-2-release-notes.html](https://docs.openshift.com/container-platform/4.2/release_notes/ocp-4-2-release-notes.html) 

 


## Red Hat CoreOS 
Download the Red Hat CoreOS OVA for OCP 4.2 from [https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.2/latest/rhcos-4.2.0-x86_64-vmware.ova](https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.2/latest/rhcos-4.2.0-x86_64-vmware.ova)

This downloaded OVA will be used for the  master and worker nodes in the initial cluster deployment.
As part of the installation process, templates will be created from the master and worker OVAs.

## OpenShift install program
The OpenShift `openshift-install` program, which is used by the playbooks to install the cluster, is available in the folder
[https://mirror.openshift.com/pub/openshift-v4/clients/ocp/](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/).


At the time of writing, the current version is OpenShift 4.2.9 and the
corresponding install program is available at
[https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.2.9/openshift-install-linux-4.2.9.tar.gz](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.2.9/openshift-install-linux-4.2.9.tar.gz).

If you want to use latest version of the OCP 4.2 `openshift-install` software, it is available in the folder
[https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest-4.2/](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest-4.2/).


Download the install program to the Ansible machine, unpack the file and note down the
path for the `openshift-install` program as you will use this when configuring the solution.

## OpenShift clients

Two client programs are used to interact with a deployed cluster - `oc` and  `kubectl`. These programs are available for download in a single file. This Openshift client software is available at 
[https://mirror.openshift.com/pub/openshift-v4/clients/ocp/](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/).

At the time of writing, the current version is OpenShift 4.2.9 and the
corresponding client software is available at
[https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.2.9/openshift-client-linux-4.2.9.tar.gz](https://mirror.openshift.com/pub/openshift-v4/cclients/ocp/4.2.9/openshift-client-linux-4.2.9.tar.gz).

If you want to use latest version of the OCP 4.2 client software, it is available in the folder [https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest-4.2/](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest-4.2/)


Download the client file to the Ansible machine, unpack the file and note down the
path for the `oc` and `kubectl` programs as you will use this when configuring the solution.


## Downloading and unpacking

An example of the commands used to download and unpack the required software is shown below (for OCP version 4.2.9):

```
$ mkdir ~/kits
$ cd ~/kits
$ wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.2.9/openshift-install-linux-4.2.9.tar.gz
$ wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.2.9/openshift-client-linux-4.2.9.tar.gz
$ wget https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.2/latest/rhcos-4.2.0-x86_64-vmware.ova
$ tar -xvf openshift-install-linux-4.2.9.tar.gz
$ tar -xvf openshift-client-linux-4.2.9.tar.gz
```

## Pull secret

From the OpenShift Infrastructure Providers page, download your installation pull secret. This pull secret allows you to authenticate with the services that are provided by the included authorities, including Quay.io, which serves the container images for OpenShift Container Platform components. The pull secret will be used in your configuration using the variable `vault.pull_secret`, in the `group_vars/all/vault.yml` file.



