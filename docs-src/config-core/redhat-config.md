# Red Hat Network configuration


|Variable|File|Description|
|:-------|:---|:----------|
|`vault.rhn_orgid`|**group_vars/all/vault.yml**| Organization ID in the Red Hat customer portal. Used together with the `rhn_key` variable.  When using the combination of `rhn_orgid` and `rhn_key`, you **must** set the `rhn_user` and `rhn_pass` variables to `''`. The specified activation key **must** be associated with a valid OpenShift subscription, and a valid `Red Hat Enterprise Linux Server` subscription if RHEL 7.6 worker nodes or support nodes are used. |
|`vault.rhn_key`|**group_vars/all/vault.yml**|An existing activation key in the organization specified above. |
|`vault.rhn_user`|**group_vars/all/vault.yml**| If you are not using activation keys, you may specify your username for the Red Hat Network. When using the combination of `rhn_user` and `rhn_pass` you **must** set the `rhn_orgid` and `rhn_key` variables to `''`. The specified user **must** be associated with a valid OpenShift subscription, and a valid `Red Hat Enterprise Linux Server` subscription if RHEL 7.6 worker nodes or support nodes are used. |
| `vault.rhn_pass`|**group_vars/all/vault.yml**| Password for the user specified with `rhn_user`|