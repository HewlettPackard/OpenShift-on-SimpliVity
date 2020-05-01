# Configuring external routes

The application you deployed in the previous section is available via the backend (internal) network.
The route created for the example application uses the application name `my-nginx-example`, 
the cluster name `ocp` and the domain name `hpecloud.org`. 

```
http://my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org
```


However, it is more likely that you will want  users to access applications via the frontend (external) network. 

The `loadbalancers` variable is used to define the internal and external networking configuration. A virtual IP (VIP) is
specified for external access to applications, and also for external (frontend) and internal (backend) access to the OCP
API. The following `loadbalancers` definition will be used in the subsequent configuration. 

```
loadbalancers:
  apps:
    vip: 10.15.156.42/24
  frontend:
    vip: 10.15.155.9/24
    interface: ens192
    vrrp_router_id: 51
  frontend:
    vip: 10.15.156.42/24
    interface: ens224
    vrrp_router_id: 51
```

In this example, we assume the domain name `cloudra.local` is used for external access to resources and services.
The DNS zone used to manage records for this specific cluster is `ocp.cloudra.local`.

You must configure the DNS resolver used by your external users - the provided playbooks will not do this for you.

- If you want users to be able to access the OpenShift API externally, you must configure `api.ocp.cloudra.local` so that it resolves to the VIP of the load balancer on the frontend network, in this example: `10.15.156.42`.
- For external access to all your applications, you must create a wildcard record in the `ocp.cloudra.local` domain for `*.apps` pointing to the same VIP `10.15.156.42`.



For the above example, the DNS records would look like:

```
;
;  Database file ocp.cloudra.local.dns for ocp.cloudra.local zone.

;
;  Zone records
;

api                     A	10.15.156.42
*.apps                  A	10.15.156.42
```

In the above example, where the DNS service is running on Windows, the file resides at  `C:\Windows\System32\dns\ocp.cloudra.local.dns`.


Now, create an Ingress resource for your sample application. This allows connections from an external client to be routed to your application by connecting to the application DNS name `my-nginx-example.apps.ocp.cloudra.local`.

```
$ cat ingress-my-nginx-example.yaml

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-nginx-example
  namespace: my-nginx-example
spec:
  rules:
  - host: my-nginx-example.apps.ocp.cloudra.local
    http:
      paths:
      - backend:
          serviceName: my-nginx-example
          servicePort: 8080
        path: /
```

Apply the ingress definition:

```
$ oc apply -f ingress-my-nginx-example.yaml

ingress.extensions/my-nginx-example created
```

Now, when you run `oc get routes`, you will see that a new route has been created for external access:

```
$ oc get routes

NAME                     HOST/PORT                                                 PATH   SERVICES           PORT  
my-nginx-example         my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org          my-nginx-example   <all> 
my-nginx-example-rvlhc   my-nginx-example.apps.ocp.cloudra.local                   /      my-nginx-example   8080  
```

Users can now access the application from the external network using the URL `http://my-nginx-example.apps.ocp.cloudra.local/`



!["Nginx example - frontend network"][media-nginx-example-frontend-png] 

**Figure. Nginx example - frontend network**

[media-nginx-example-frontend-png]:<../images/nginx-example-frontend.png> "Figure. Nginx example - frontend network"
