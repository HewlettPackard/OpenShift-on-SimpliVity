# Cluster verification


A cluster verification program is run as the last stage of the `site.yml` deployment playbook. This program
installs a sample Wordpress / MySql application, validates that it is working as expected and then tears down the
application so that there are no artefacts left behind in your cluster.

In the provision stage, the verification test initially deploys the application by:

- Creating a namespace (project)
- Creating a storage class used to provide persistent storage for WordPress and MySQL
- Creating persistent volume claims (PVC) for WordPress and MySQL
- Creating deployments for WordPress and MySQL
- Creating services for WordPress and MySQL
- Exposing a route to the WordPress application server

The validation stage ensures that the MySQL and WordPress pods are ready and then it tests HTTP connectivity to the
WordPress application server.

Finally, all resources that were created by the deployment are removed in the teardown stage.


## Configuration variables for verification program

The variables used to configure the verification program are listed in the following table.

|Variable|File|Description|
|:-------|:---|:----------|
|`wp_app_name`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wordpress'`|
|`wp_proj_name`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wordpress-ns'`|
|`wp_disp_name`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'HPE WordPress/MySQL validation deployment'`|
|`wp_desc`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'HPE Wordpress/MySQL Deployment'`|
|`wp_storage_name`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wp-storage-class'`|
|`wp_mysql_pv_claim`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-mysql-pv-claim'`|
|`wp_mysql_svc`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-mysql-service'`|
|`wp_mysql_route`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-mysql-route'`|
|`wp_mysql_deploy`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-mysql-deploy'`|
|`wp_wp_pv_claim`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wp-pv-claim'`|
|`wp_wp_svc`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wordpress-service'`|
|`wp_wp_route`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wordpress-route'`|
|`wp_wp_deploy`|**playbooks/roles/wordpress/defaults/main.yml**|Defaults to `'hpe-wp-deploy'`|




## Manually running the verification program

You can run the individual stages of the verification program using the playbook `playbooks/wordpress.yml`.

To simply provision the Wordpress / MySQL application, set the options to not validate and to not teardown the deployment.

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/wordpress.yml -e "validate=no teardown=no"
````


To run the validation tasks after the application has been provisioned:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/wordpress.yml -e "provision=no teardown=no"
```

To run the teardown tasks:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/wordpress.yml -e "provision=no validate=no"
```

Running the playbook without any options will perform all three tasks - provision, validate and teardown:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/wordpress.yml
```



