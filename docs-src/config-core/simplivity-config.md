# HPE SimpliVity configuration

To take advantage of functionality that is specific to HPE SimpliVity (as opposed to core VMware functionality), you need to
identify the IP address of each OmniStack appliance in your HPE SimpliVity cluster. In the `group_vars/all/vars.yml`
configuration file, add an array of addresses using the `simplivity_appliances` variable as shown in the following example:

```
simplivity_appliances:
- 10.10.173.109
- 10.10.173.110
- 10.10.173.111
```

If you do not configure this variable, or if the list is empty, you will not be able to take advantage of functionality,
described in the remainder of this section, that is specific to HPE SimpliVity. You are only required to have one entry
in this list, but HPE recommends that you add multiple entries for the purposes of high availability.

## Automatic provisioning of datastores

Instead of manually creating a datastore for the VMs before starting your deployment, you can now use the playbooks
to provision a datastore for you with a particular size. This functionality requires that you configure
the `simplivity_appliances` list as described in the previous section.

If a datastore does not already exist corresponding to the first entry in the `datastores` list, the playbooks will create a
datastore with this name. If the `datastore_size` variable is specified, the datastore will be created with that size,
otherwise it will default to 1024 GiB.


|Variable|File|Description|
|:-------|:---|:----------|
|`datastores`|group_vars/all/vars.yml|List of datastores for storing VMs. For example, ['Openshift_HPE']|
|`datastore_size`|group_vars/all/vars.yml|Optional size of datastore, specified in GiB. Defaults to 1024 GiB.|

You can take advantage of this functionality when provisioning persistent volumes for Container Storage
Interface (CSI). For more information, see the section on [Container Storage Interface](../storage/csi).



