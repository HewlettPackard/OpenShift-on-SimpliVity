# Sample vault file

A vault file is used to protect any sensitive variables that should not appear in clear text in your `group_vars/all/vars.yml` file. The vault file will be encrypted and will require a password to be entered before it can be read or updated.

A sample vault file is provided named `group_vars/all/vault.sample` that you can use as a model for your own vault file. To create a vault, you create a new file called `group_vars/all/vault.yml` and add entries similar to:

```
---
vault:
  vcenter_password: 'YourvCenterAdminPassword'
  rhn_orgid: 'YourRHNOrgId'
  rhn_key: 'YourRHNkey'
  rhn_user: 'YourRHNuser'
  rhn_pass: 'YourRHNpassword'
  pull_secret: '...  replace with your pull secret  ...'
  ssh_key: '...  replace with your ssh public key  ...'
  ldap_bind_user_password: 'password of LDAP user used for binding with LDAP'
  sysdig_access_key: 'your sysdig access key here'
```