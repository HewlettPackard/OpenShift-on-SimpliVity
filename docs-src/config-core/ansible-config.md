# Ansible configuration

On the Ansible node, retrieve the latest version of the playbooks using Git.

```
$ cd ~

$ git clone https://github.com/HewlettPackard/OpenShift-on-SimpliVity.git
```

Change to the directory that was created using the `git clone` command:

```
$ cd ~/OpenShift-on-SimpliVity
```

**Note:** All subsequent file names are relative to the OpenShift-on-SimpliVity directory, except where explicitly stated. For example, the Ansible inventory file `hosts` is located in the top-level `~/OpenShift-on-SimpliVity` while `group_vars/all/vars.yml` corresponds to `~/OpenShift-on-SimpliVity/group_vars/all/vars.yml`.


You now need to prepare the configuration to match your own environment, prior to deploying OpenShift. To do so, you will need to create and populate a number of files including:

- `hosts` - the inventory file
- `group_vars/all/vars.yml` - the group variables file used by all playbooks and roles
- `group_vars/all/vault.yml` - the global vault file containing sensitive information that needs to be protected


The following sections will guide you through the various configuration options. To get you started, corresponding sample files that you can use as a basis for your configuration are available at

- `hosts.sample`
- `group_vars/all/vars.sample`
- `group_vars/all/vault.sample`



