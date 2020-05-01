# Appendix B: Sample LDAP CR

A sample Custom Resource (CR), `playbooks/roles/ldap/vars/ldap_cr.yml`, is included in the solution. It shows
the parameters and example values for an LDAP identity provider.

```
apiVersion: config.openshift.io/v1
kind: OAuth
metadata:
  name: cluster
spec:
  identityProviders:
  - name: msad
    mappingMethod: claim
    type: LDAP
    ldap:
      attributes:
        id:
        - name
        email:
        - UserPrincipalName
        name:
        - cn
        preferredUsername:
        - sAMAccountName
      bindDN: "{{ ldap_bind_user_dn }}"
      bindPassword:
        name: ldap-secret
      ca:
        name: ca-config-map
      insecure: false
      url: "ldaps://mars-adds.am2.cloudra.local/CN=Users,DC=am2,DC=cloudra,DC=local?sAMAccountName??(objectClass=person)"
```

- The identity provider name is prefixed to the returned user ID to form an identity name. In this instance, the example name `msad` is used to indicate Microsoft Active Directory is being used. After the identity provider has been set up, you can use the `oc get identities` command to see the prefix in use:

    ```
    $ oc get identities
    NAME                            IDP NAME   IDP USER NAME              USER NAME     
    msad:YWRvY3AgYWRtaW4x           msad       YWRvY3AgYWRtaW4x           adocpadmin1   
    msad:YWRvY3AgdXNlcjE            msad       YWRvY3AgdXNlcjE            adocpuser1
    ```

    The identity provider name is also displayed as an option when logging in to the web console. 

- The `bindDN` parameter is the name of the LDAP user required to perform the search. This value is actually defined in the `group_vars\all\vars.yml` file using the variable `ldap_bind_user_dn`.

- The `bindPassword` is stored in a secret which is created when you run the `playbooks\ldap.yml` playbook. The underlying password itself should be strored in `group_vars/all/vault.yml` as the value of the variable `vault.ldap_bind_user_password`.

- The `mappingMethod` defines how new identities are mapped to users when they log in. The value `claim` will cause a new user to be created if one does not already exist with that name. It will fail if a user with that user name is already mapped to another identity.

- The `url` is an RFC 2255 URL, which specifies the LDAP host and search parameters to use. The syntax of the URL is:
    ```
    ldap://host:port/basedn?attribute?scope?filter
    ```

More information on configuring the custom resource is available at
[https://docs.openshift.com/container-platform/4.2/authentication/identity_providers/configuring-ldap-identity-provider.html](https://docs.openshift.com/container-platform/4.2/authentication/identity_providers/configuring-ldap-identity-provider.html).







