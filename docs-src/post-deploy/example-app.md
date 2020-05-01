# Deploy example application

Create a new project (namespace) "my-nginx-example".

```
$ oc new-project my-nginx-example
```


Deploy a new application:

```
$ oc new-app --template=openshift/nginx-example --name=my-nginx-example --param=NAME=my-nginx-example

--> Deploying template "openshift/nginx-example" for "openshift/nginx-example" to project my-nginx-example

--> Creating resources ...
    service "my-nginx-example" created
    route.route.openshift.io "my-nginx-example" created
    imagestream.image.openshift.io "my-nginx-example" created
    buildconfig.build.openshift.io "my-nginx-example" created
    deploymentconfig.apps.openshift.io "my-nginx-example" created
--> Success
    Access your application via route 'my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org'
    Build scheduled, use 'oc logs -f bc/my-nginx-example' to track its progress.
    Run 'oc status' to view your app.
```

The output shows that a service and route have been created for the application, and tells you to use the `oc status` command to check your application:

```
$ oc status
In project my-nginx-example on server https://api.ocp.hpecloud.org:6443

http://my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org (svc/my-nginx-example)
  dc/my-nginx-example deploys istag/my-nginx-example:latest <-
    bc/my-nginx-example source builds https://github.com/sclorg/nginx-ex.git on openshift/nginx:1.12
    deployment #1 deployed 23 minutes ago - 1 pod
```

The details of the service can be obtained using the `oc get svc` command:

```
$ oc get svc my-nginx-example
NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
my-nginx-example   ClusterIP   172.30.155.90   <none>        8080/TCP   3m26s
```

The route created for the example application  uses the application name `my-nginx-example`, 
the cluster name `ocp` and the domain name `hpecloud.org`. 

```
$ oc get route my-nginx-example

NAME               HOST/PORT                                                 PATH   SERVICES           PORT    
my-nginx-example   my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org          my-nginx-example   <all>       
```


Use the route in your browser to access the application:

!["Nginx example - backend network"][media-nginx-example-backend-png] 

**Figure. Nginx example - backend network**

[media-nginx-example-backend-png]:<../images/nginx-example-backend.png> "Figure. Nginx example - backend network"