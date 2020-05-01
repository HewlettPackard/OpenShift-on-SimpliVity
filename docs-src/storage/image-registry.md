# Image registry

The default vSphere Cloud Provider does not support the `ReadWriteMany` access mode required by the Image Registry.
As a result, the playbook for initial cluster deployment, `site.yml`, deploys an NFS virtual machine. A number of NFS
shares are created and exported by the playbooks, and the Image Registry uses one of these NFS shares.

The number of NFS shares created by the playbooks can be customized using the variable `num_nfs_shares` in the
configuration file `group_vars/all/vars.yml`. Only one share is required by the Image Registry service. 