# OpenShift configuration

All the variables are mandatory, unless otherwise stated.

|Variable|File|Description|
|:-------|:---|:----------|
|`local_home`|group_vars/all/vars.yml|Local user's HOME directory. Defaults to the `HOME` environment variable|
|`ocp_installer_path`|group_vars/all/vars.yml|Path to the downloaded OCP installer. Defaults to `<<local_home>>/kits/openshift-install`|
|`ocp_oc_path`|group_vars/all/vars.yml|Path to the downloaded `oc` client. Defaults to `<<local_home>>/kits/oc`|
|`ocp_kubectl_path`|group_vars/all/vars.yml|Path to the downloaded `kubectl` client. Defaults to `<<local_home>>/kits/kubectl`|
|`vault.pull_secret`|**group_vars/all/vault.yml**|The pull secret obtained from Red Hat installation web page|
|`install_dir`|group_vars/all/vars.yml|The directory where files that are generated as part of the OCP installation will be saved. If you are re-running the playbooks after a previous deployment, you should delete any existing content in this folder first. Defaults to `<<local_home>>/.ocp`|
|`master_ova_path`|group_vars/all/vars.yml|Path to RHCOS OVA for master nodes. The version of the RHCOS OVA should match the version of OCP that you are installing. Defaults to `<<local_home>>/kits/rhcos.ova`|
|`worker_ova_path`|group_vars/all/vars.yml|Path to RHCOS OVA for worker nodes. Defaults to same value as `master_ova_path`|
|`master_template`|group_vars/all/vars.yml|Name of template generated from master OVA. Defaults to `hpe-rhcos`|
|`worker_template`|group_vars/all/vars.yml|Name of template generated from worker OVA. Uses the same value as `master_template` if the same OVA is used for both master and worker nodes.|
|`support_template`|group_vars/all/vars.yml|The template used to create support machines including the load balancers, NFS and nodes hosting DNS and DHCP services. If this value is not present, the playbooks will use the support OVA specified by `support_ova_path`. Defaults to `hpe-rhel760`|
|`support_ova_path`|group_vars/all/vars.yml|Instead of specifiying a template for support machines, you can use an OVA instead.  Defaults to `<<local_home>>/kits/hpe-rhel760.ova`|
|`support_folder`|group_vars/all/vars.yml|This folder is created in vCenter (if it does not already exist) for the non-OCP VMs and templates. Defaults to `hpeSupport`|
|`vault.ssh_key`|**group_vars/all/vault.yml**|The public SSH key for the `core` user on the Ansible controller node|




