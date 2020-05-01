# LDAP integration


By default, only a `kubeadmin` user exists on your cluster after the initial deployment. To specify an identity provider, you must create an OCP custom resource (CR) that describes the identity provider and then add it to the cluster. This solution
provides a playbook to assist in the creation of such a custom resource for an LDAP identity provider.


## About LDAP authentication in OCP

During authentication, the LDAP directory is searched for an entry that matches the provided user name. If a single unique match is found, a simple bind is attempted using the distinguished name (DN) of the entry plus the provided password. If the LDAP directory requires authentication to search, you must specify a bindDN and bindPassword for the account used when performing the entry search.

For more information on using LDAP, see the OpenShift Container Platform 4.2
documentation for
[Configuring LDAP Identity Provider](https://docs.openshift.com/container-platform/4.2/authentication/identity_providers/configuring-ldap-identity-provider.html)


## Configuring LDAP variables


All variables relating to LDAP configuration are described in the table below.

|Variable|File|Description|
|:-------|:---|:----------|
|`ldap_bind_user_dn`|group_vars/all/vars.yml|The name (or Bind DN) of the LDAP user required to perform the search.|
|`vault.ldap_bind_user_password`|<b>group_vars/all/vault.yml</b>|Password for the LDAP user account used to perform the search.|
|`ldap_ca_file`|group_vars/all/vars.yml|Location of the CA Bundle of the LDAP server, exported in PEM format. A sample file is provided in `playbooks/roles/ldap/files/ca.pem`|
|`ldap_cr_file`|group_vars/all/vars.yml|Location of the Custom Resource used to configure an Identity Provider. A sample file is provided in `playbooks/roles/ldap/vars/ldap_cr.yml`|


Extracting the certificate authority (CA) bundle is specific to your particular LDAP server and is
beyond the scope of this guide. Once you have
obtained the information in the correct PEM format, you should store it in a file on your Ansible controller.
The location of this file is used as the value of the `ldap_ca_file` variable.

The parameters and values in the Custom Resource file are highly dependent on your particular environment and,
as a result,
these cannot be generalized in the solution. [Appendix B](/appendices/appendix-b) provides a detailed overview of the sample Custom Resource file
that comes with this solution and more information can be found in the OCP online documentation in the article
[Understanding identity provider configuration](https://docs.openshift.com/container-platform/4.2/authentication/understanding-identity-provider.html).




## Testing the configuration

Before running the playbook, it can be helpful to manually test your configuration. Install a tool such as `ldapsearch`
using `dnf install -y openldap-clients`
and attempt to perform a query using the configuration information you have established. Initially, it is easier to use
insecure `ldap` access, rather than secure `ldaps`, to perform the search. The following example uses the bind DN
of `adreader` and, as a result of specifying the `-W` flag, you will be prompted to enter the corresponding password. You will need to adapt the URI `ldap://mars-adds.am2.cloudra.local` and the parameters to your own environment.

For the example to be successful, you must have added a user `adocpuser1` in the directory.

```
$ dnf install -y openldap-clients

$ ldapsearch -H ldap://mars-adds.am2.cloudra.local \
         -x -W -D "cn=adreader,cn=Users,dc=am2,dc=cloudra,dc=local" \
         -b "cn=Users,dc=am2,dc=cloudra,dc=local" \
         "(&(objectClass=person)(sAMAccountName=adocpuser1))"`

```

The above query will replicate what the identity provider does when a user named `adocpuser1` attempts to log in. If this
user exists in your LDAP directory, the search will return a single directory entry, similar to the following:

```
filter: (&(objectClass=person)(sAMAccountName=adocpuser1))
requesting: All userApplication attributes
# extended LDIF
#
# LDAPv3
# base <cn=Users,dc=am2,dc=cloudra,dc=local> with scope subtree
# filter: (&(objectClass=person)(sAMAccountName=adocpuser1))
# requesting: ALL
#

# adocp user1, Users, am2.cloudra.local
dn: CN=adocp user1,CN=Users,DC=am2,DC=cloudra,DC=local
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: user
cn: adocp user1
sn: user1
givenName: adocp
distinguishedName: CN=adocp user1,CN=Users,DC=am2,DC=cloudra,DC=local
instanceType: 4
whenCreated: 20191111160653.0Z
whenChanged: 20191112100318.0Z
displayName: adocp user1
uSNCreated: 188305
memberOf: CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local
uSNChanged: 188439
name: adocp user1
objectGUID:: FomFmxLnoEi0pnyxTbjHFg==
userAccountControl: 66048
badPwdCount: 0
codePage: 0
countryCode: 0
badPasswordTime: 0
lastLogoff: 0
lastLogon: 0
pwdLastSet: 132179620134013170
primaryGroupID: 513
objectSid:: AQUAAAAAAAUVAAAA1r8HwaYUleyBG+FYcgQAAA==
accountExpires: 9223372036854775807
logonCount: 0
sAMAccountName: adocpuser1
sAMAccountType: 805306368
userPrincipalName: adocpuser1@am2.cloudra.local
objectCategory: CN=Person,CN=Schema,CN=Configuration,DC=am2,DC=cloudra,DC=local
dSCorePropagationData: 20191111160653.0Z
dSCorePropagationData: 16010101000000.0Z
lastLogonTimestamp: 132180265987003551

# search result
search: 2
result: 0 Success

# numResponses: 2
# numEntries: 1
```

Once your testing with insecure access is successful, configure `ldapsearch` with the appropriate CA certificate
for your LDAP server and then switch to using `ldaps` to test secure access as performed by the playbook.

## Overview of the playbook

The playbook requires a username and password to access the LDAP directory. You must also supply the PEM file
and then configure the custom resource file (detailed in Appendix B) to match your particular environment.

When you run the playbook, it creates an OpenShift Container Platform `Secret` named `ldap-secret` that
contains the `bindPassword`, used to access the identity provider. It also creates a `ConfigMap` named `ca-config-map`
in the `openshift-config` namespace to contain the certificate authority bundle, To support secure access to the
identity provider.

## Running the playbook

When you have confirmed that you can securely access to the LDAP directory and have configured all the required
variables and files to match your LDAP environment, you can run the integration playbook as follows:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/ldap.yml --vault-password-file .vault_pass
```

You may have to wait a few seconds after the playbook completes, before the authentication cluster operator is available.


## Verification

You can now attempt to log in using the LDAP identity provider, using either the command line or the web console.

```
$ oc login -u adocpuser1
Authentication required for https://api.ocp.hpecloud.org:6443 (openshift)
Username: adocpuser1
Password:
Login successful.

You don't have any projects. You can try to create a new project, by running

    oc new-project <projectname>


$ oc whoami
adocpuser1
```


## Synchronizing groups

As an OpenShift administrator, you can use groups to manage users, change their permissions, and enhance collaboration.
Your organization may have already created user groups and stored them in an LDAP server. OpenShift can sync those
LDAP records with internal OpenShift records, enabling you to manage your groups in one place. OpenShift currently
supports group sync with LDAP servers using three common schemas for defining group membership:
RFC 2307, Active Directory, and augmented Active Directory. More information on LDAP synchronization is available
in the OCP documentation at
 [https://docs.openshift.com/container-platform/4.2/authentication/ldap-syncing.html](https://docs.openshift.com/container-platform/4.2/authentication/ldap-syncing.html).

This solution does not provide any playbooks to support synchronization. However, the following example shows how
it can be performed manually. It assumes that you have created a group of ordinary users in your LDAP directory,
named `adocpusers` and containing users `adocpuser1` and `adocpuser2`.
It also assumes a group of administrators, `adocpadmins`, containing users `adocpadmin1` and `adocpadmin2`.


## Sync example

In order to sync OpenShift group records with those from an external provider, determine which groups you wish to sync
and where their records live. For instance, all or some groups may be selected from those stored on an LDAP
server. The path to a sync configuration file is required in order to describe how data is requested from the external
record store and migrated to OpenShift records. Default behavior is to do a dry-run without changing OpenShift records.
Passing '--confirm' will sync all groups from the LDAP server returned by the LDAP query templates.


Create a sync file `ad-config.yaml` similar to the following, adapting the parameters and values for your own environment.

```
kind: LDAPSyncConfig
apiVersion: v1
url: ldaps://mars-adds.am2.cloudra.local
ca: playbooks/roles/ldap/files/ca.pem
insecure: false
bindDN: cn=adreader,cn=Users,dc=am2,dc=cloudra,dc=local
bindPassword: *******
activeDirectory:
  usersQuery:
    baseDN: cn=Users,dc=am2,dc=cloudra,dc=local
    scope: sub
    derefAliases: never
    filter: (objectClass=person)
    pageSize: 0
  userNameAttributes: [ sAMAccountName ]
  groupMembershipAttributes: [ memberOf ]
```

Run the sync command, without the `--confirm` flag, to identify the groups in your LDAP directory:

```
$ oc adm groups sync --sync-config=ad-config.yaml
```

This command will produce output similar to the following:

```
...
- metadata:
    annotations:
      openshift.io/ldap.sync-time: 2019-11-12T06:41:23-0500
      openshift.io/ldap.uid: CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local
      openshift.io/ldap.url: mars-adds.am2.cloudra.local:636
    creationTimestamp: "2019-11-12T11:37:15Z"
    labels:
      openshift.io/ldap.host: mars-adds.am2.cloudra.local
    name: adocpadmins
    resourceVersion: "1924931"
    selfLink: /apis/user.openshift.io/v1/groups/adocpadmins
    uid: c6c1ba9d-0540-11ea-bcd8-0a580a80021c
  users:
  - adocpadmin1
  - adocpadmin2
...
- metadata:
    annotations:
      openshift.io/ldap.sync-time: 2019-11-12T06:41:23-0500
      openshift.io/ldap.uid: CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local
      openshift.io/ldap.url: mars-adds.am2.cloudra.local:636
    creationTimestamp: "2019-11-12T11:38:02Z"
    labels:
      openshift.io/ldap.host: mars-adds.am2.cloudra.local
    name: adocpusers
    resourceVersion: "1925158"
    selfLink: /apis/user.openshift.io/v1/groups/adocpusers
    uid: e240adc2-0540-11ea-8e34-0a580a810017
  users:
  - adocpuser1
  - adocpuser2
```

Note how the `ldap.uid` fields use capital letters: `CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local`.

Before syncing the data, add `groupUIDNameMapping` to your sync configuration file to map the LDAP groups to the
group names you want to use in OCP, in this instance `adocpusers` and `adocpadmins`:

```
groupUIDNameMapping:
  "CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local": adocpusers
  "CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local": adocpadmins
```

So your complete sync file should now look like:

```
kind: LDAPSyncConfig
apiVersion: v1
url: ldaps://mars-adds.am2.cloudra.local
ca: playbooks/roles/ldap/files/ca.pem
insecure: false
bindDN: cn=myuser,cn=Users,dc=am2,dc=cloudra,dc=local
bindPassword: ********
groupUIDNameMapping:
  "CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local": adocpusers
  "CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local": adocpadmins
activeDirectory:
  usersQuery:
    baseDN: cn=Users,dc=am2,dc=cloudra,dc=local
    scope: sub
    derefAliases: never
    filter: (objectClass=person)
    pageSize: 0
  userNameAttributes: [ sAMAccountName ]
  groupMembershipAttributes: [ memberOf ]
```

By default, the sync command will synchronize based on all the data found in your LDAP directory. You can limit the
sync to specific groups by supplying a whitelist to the sync command. Run the command without the `--confirm` flag,
and provide a whitelist of the groups you want to sync, using the `ldap.uid` values returned earlier:

```
$ oc adm groups sync \
   --sync-config=ad-config.yaml \
   "CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local" \
   "CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local"
```

The command will perform a dry-run and return the values it would have synchronized, showing the two groups and the
corresponding users:

```
apiVersion: v1
items:
- metadata:
    annotations:
      openshift.io/ldap.sync-time: 2019-11-14T05:54:50-0500
      openshift.io/ldap.uid: CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local
      openshift.io/ldap.url: mars-adds.am2.cloudra.local:636
    creationTimestamp: "2019-11-12T11:38:02Z"
    labels:
      openshift.io/ldap.host: mars-adds.am2.cloudra.local
    name: adocpusers
    resourceVersion: "1925158"
    selfLink: /apis/user.openshift.io/v1/groups/adocpusers
    uid: e240adc2-0540-11ea-8e34-0a580a810017
  users:
  - adocpuser1
  - adocpuser2
- metadata:
    annotations:
      openshift.io/ldap.sync-time: 2019-11-14T05:54:50-0500
      openshift.io/ldap.uid: CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local
      openshift.io/ldap.url: mars-adds.am2.cloudra.local:636
    creationTimestamp: "2019-11-12T11:37:15Z"
    labels:
      openshift.io/ldap.host: mars-adds.am2.cloudra.local
    name: adocpadmins
    resourceVersion: "1924931"
    selfLink: /apis/user.openshift.io/v1/groups/adocpadmins
    uid: c6c1ba9d-0540-11ea-bcd8-0a580a80021c
  users:
  - adocpadmin1
  - adocpadmin2
kind: List
metadata: {}
```

Now run the sync command with the `--confirm` flag to synchronize the groups to your OCP cluster:

```
$ oc adm groups sync \
   --sync-config=ad-config.yaml \
   "CN=adocpusers,CN=Users,DC=am2,DC=cloudra,DC=local" \
   "CN=adocpadmins,CN=Users,DC=am2,DC=cloudra,DC=local" \
   --confirm

group/adocpusers
group/adocpadmins
```


You can confirm that the groups have been added to the cluster:

```
$ oc get groups

NAME          USERS
adocpadmins   adocpadmin1, adocpadmin2
adocpusers    adocpuser1, adocpuser2
```


## Adding cluster admin role to group


Once you have added the `adocpadmins` group to your cluster, you can give administration privileges to
members of the group.

Log in with the initial `kubeadmin` user account, as outlined in the section [Logging into the OCP cluster for the first time](first-login).

Assign the `cluster-admin` role to the `adocpadmins` group:

```
$ oc adm policy add-cluster-role-to-group cluster-admin adocpadmins
```

Now, when a member of the `ocadmingroup` logs in to the cluster, the user will have cluster adminsitration privileges and access to all the projects/namespaces:

```
$ oc login -u adocpadmin1
Authentication required for https://api.ocp.hpecloud.org:6443 (openshift)
Username: adocpadmin1
Password:
Login successful.

You have access to the following projects and can switch between them with 'oc project <projectname>':

  * default
    kube-public
    kube-system
    openshift
    openshift-apiserver
    openshift-apiserver-operator
    openshift-authentication
    openshift-authentication-operator
    openshift-cloud-credential-operator
    openshift-cluster-machine-approver
    openshift-cluster-node-tuning-operator
    openshift-cluster-samples-operator
...
```

It is recommended that you delete the initial `kubeadmin` user, once you have successfully created and tested new admin user accounts:

```
$ oc delete secret kubeadmin -n kube-system
```





