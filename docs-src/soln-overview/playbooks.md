# Ansible playbooks 

The OpenShift-on-SimpliVity Ansible playbooks are available to download at [https://github.com/HewlettPackard/OpenShift-on-SimpliVity](https://github.com/HewlettPackard/OpenShift-on-SimpliVity).
By default, the playbooks are configured to initially deploy three master nodes and two worker nodes. This is the minimal
starter configuration recommended by HPE and Red Hat for production.


This document shows you how to:

- Prepare the VM templates
- Create the Fedora Ansible host and RHEL 7.6 template
- Configure the required Ansible parameters
- Run the Ansible playbooks for initial deployment
- Perform post-deployment tasks and validation
- Add CoreOS and RHEL 7.6 worker nodes to the cluster
- Deploy cluster logging
- Backup and restore your cluster


Deploying HPE SimpliVity hardware is specific to your environment and is not covered in this document. 
HPE SimpliVity documentation is available in the [Hewlett Packard Enterprise Support Center](https://support.hpe.com/hpesc/public/home).