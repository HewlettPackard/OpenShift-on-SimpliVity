# Protecting sensitive information

The Ansible file is used to protect any sensitive variables that should not appear in clear text in your
`group_vars/all/vars.yml` file. The vault file should be encrypted, requiring a password to be entered 
before it can be read or updated.

A sample vault file is provided named `group_vars/all/vault.sample`. You can use this sample as a model for your own vault file. All variables in the vault are defined as keys inside a `vault` dictionary.





|Variable|File|Description|
|:-------|:---|:----------|
|`vault.vcenter_password`|**group_vars/all/vault.yml**|The password for the `vcenter_username` user above.|
|`vault.rhn_orgid`|**group_vars/all/vault.yml**| Organization ID in the Red Hat customer portal. Used together  with the `rhn_key` variable.  When using the combination of `rhn_orgid` and `rhn_key`, you **must** set the   `rhn_user` and `rhn_pass` variables to `''`. The specified activation key **must** be associated with a valid `OpenShift` subscription, and a valid `Red Hat Enterprise Linux Server` subscription if RHEL 7.6 worker nodes or support nodes are used. |
|`vault.rhn_key`|**group_vars/all/vault.yml**|An existing activation key in the organization specified above. |
|`vault.rhn_user`|**group_vars/all/vault.yml**| If you are not using activation keys, you may specify the username associated with your Red Hat Network. When using the combination of `rhn_user` and `rhn_pass` you **must** set the `rhn_orgid` and `rhn_key` variables to `''`. The specified user **must** be associated with a valid `OpenShift` subscription, and a valid `Red Hat Enterprise Linux Server` subscription if RHEL 7.6 worker nodes or support nodes are used. |
|`vault.rhn_pass`|**group_vars/all/vault.yml**| Password for the user specified with `rhn_user`|
|`vault.pull_secret`|**group_vars/all/vault.yml**|The pull secret obtained from Red Hat installation web page|
|`vault.ssh_key`|**group_vars/all/vault.yml**|The public SSH key for the `core` user on the Ansible controller node|
|`vault.ldap_bind_user_password`|**group_vars/all/vault.yml**|The password of the Bind DN user when integrating with an LDAP Directory|
|`vault.sysdig_access_key`|**group_vars/all/vault.yml**|Your API key for Sysdig|

## Encrypting your vault
To encrypt the vault you need to run the following command:
```
# ansible-vault encrypt group_vars/all/vault.yml
```

You will be prompted for a password that will decrypt the vault when required. You can update the values in your vault by running:

```
$ ansible-vault edit group_vars/all/vault.yml
```

In order for Ansible to be able to read the vault, you need to specify  where the password is stored, for instance, in a file called `.vault_pass`. Once the file is created, take the following precautions to avoid illegitimate access to this file:

1. Change the permissions of the `.vault_pass` file so only root users can read it using the command:
    ```
    $ chmod 600 .vault_pass
    ```
2. Add the file to your `.gitignore` file, if you are using a Git repository to manage your playbooks.

When you use a vault, you must specify the password file every time on the command line, for example,

```
# ansible-playbook -i hosts site.yml --vault-password-file .vault_pass
```

