# Playbook summary


## Initial deployment
The main entry point for the OpenShift on SimpliVity Ansible playbooks is:

- `site.yml` for initial deployment

## Post deployment playbooks

A number of playbooks are provided to help with post-deployment tasks:

- `playbooks/scale.yml` used when adding RHCOS or RHEL 7.6 worker nodes
- `playbooks/efk.yml` used to deploy the Elasticsearch, Fluentd and Kibana (EFK) logging stack
- `backup_etcd.yml` used in the etcd backup and restore procedure
- `playbooks/ldap.yml` used for LDAP integration
- `playbooks/csi.yml` used for CSI integration
- `playbooks/sysdig.yml` used to integrate your cluster with Sysdig
- `playbooks/clean.yml` a convenience playbook for stripping down a cluster, potentially before redeploying










