# Exposing the image registry


To allow access to the image registry from outside the cluster, you need to set up a route.

## Check the registry deployment

Ensure that the image registry has been deployed successfully - `AVAILABLE` should be `True` for `image-registry`:

```
$ oc get clusteroperators

NAME                                 VERSION   AVAILABLE   PROGRESSING   DEGRADED   SINCE
authentication                       4.2.9    True        False         False      110m
cloud-credential                     4.2.9    True        False         False      126m
cluster-autoscaler                   4.2.9    True        False         False      126m
console                              4.2.9    True        False         False      117m
dns                                  4.2.9    True        False         False      126m
image-registry                       4.2.9    True        False         False      119m
ingress                              4.2.9    True        False         False      120m
...
```


## Add a route for the image registry

There is no default route exposed to the image registry. To check all existing routes:

```
$ oc get routes --all-namespaces

NAMESPACE                  NAME                HOST/PORT                                                      PATH   SERVICES            PORT    TERMINATION            WILDCARD
openshift-authentication   oauth-openshift     oauth-openshift.apps.ocp.hpecloud.org                                 oauth-openshift     6443    passthrough/Redirect   None
openshift-console          console             console-openshift-console.apps.ocp.hpecloud.org                       console             https   reencrypt/Redirect     None
openshift-console          downloads           downloads-openshift-console.apps.ocp.hpecloud.org                     downloads           http    edge                   None
openshift-monitoring       alertmanager-main   alertmanager-main-openshift-monitoring.apps.ocp.hpecloud.org          alertmanager-main   web     reencrypt/Redirect     None
openshift-monitoring       grafana             grafana-openshift-monitoring.apps.ocp.hpecloud.org                    grafana             https   reencrypt/Redirect     None
openshift-monitoring       prometheus-k8s      prometheus-k8s-openshift-monitoring.apps.ocp.hpecloud.org             prometheus-k8s      web     reencrypt/Redirect     None
```

There are two ways to add a default route. The first method involves editing the appropriate OCP configuration resource:


```
$ oc edit configs.imageregistry.operator.openshift.io/cluster
```

In the "spec" section, you will see `defaultRoute: false`. Edit the`defaultRoute` value and 
set it to `true` and then save the change.


```
apiVersion: imageregistry.operator.openshift.io/v1
kind: Config
metadata:
  creationTimestamp: "2019-09-26T11:26:36Z"
  finalizers:
  - imageregistry.operator.openshift.io/finalizer
  generation: 2
  name: cluster
  resourceVersion: "12677"
  selfLink: /apis/imageregistry.operator.openshift.io/v1/configs/cluster
  uid: 80012535-e050-11e9-9ede-005056815623
spec:
  defaultRoute: true
...   
```



Alternatively, use the `oc patch` command instead of editing the resource directly:

```
$ oc patch configs.imageregistry.operator.openshift.io/cluster --type merge -p '{"spec":{"defaultRoute":true}}'

config.imageregistry.operator.openshift.io/cluster patched
```

After setting the `defaultRoute` to `true`, re-run the `oc get routes` command:

```
$ oc get routes --all-namespaces

NAMESPACE                  NAME                HOST/PORT                                                      PATH   SERVICES            PORT    TERMINATION            WILDCARD
...
openshift-image-registry   default-route       default-route-openshift-image-registry.apps.ocp.hpecloud.org          image-registry      <all>   reencrypt              None
...
```


You should now be able to access the registry from outside the cluster at `default-route-openshift-image-registry.apps.ocp.hpecloud.org`

To test access to the image registry, start by getting your token using `oc whoami -t`:

```
$ oc whoami -t

_UgOx6ujcndWWb8WXQM7sTEk7IwNSb8lpDPdWX-lRQI
```

Now use the token in the following `curl` command, substituting your own cluster name and domain in the URL:

```
$ curl -v -tlsv1.2 --insecure -H "Authorization: Bearer _UgOx6ujcndWWb8WXQM7sTEk7IwNSb8lpDPdWX-lRQI" "https://default-route-openshift-image-registry.apps.ocp.hpecloud.org/healthz"

*   Trying 10.15.156.42...
* TCP_NODELAY set
* Connected to default-route-openshift-image-registry.apps.ocp.hpecloud.org (10.15.156.42) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/pki/tls/certs/ca-bundle.crt
  CApath: none
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server did not agree to a protocol
* Server certificate:
*  subject: CN=*.apps.ocp.hpecloud.org
*  start date: Sep 26 11:26:43 2019 GMT
*  expire date: Sep 25 11:26:44 2021 GMT
*  issuer: CN=ingress-operator@1569497203
*  SSL certificate verify result: self signed certificate in certificate chain (19), continuing anyway.
> GET /healthz HTTP/1.1
> Host: default-route-openshift-image-registry.apps.ocp.hpecloud.org
> User-Agent: curl/7.61.1
> Accept: */*
> Authorization: Bearer _UgOx6ujcndWWb8WXQM7sTEk7IwNSb8lpDPdWX-lRQI
>
< HTTP/1.1 200 OK
< Cache-Control: no-cache
< Date: Thu, 26 Sep 2019 13:51:26 GMT
< Content-Length: 0
< Set-Cookie: 34727b82525eb26a530629c5bf0ec2f2=a086c79adfabfb34ab28ba82bf3646eb; path=/; HttpOnly; Secure
<
* Connection #0 to host default-route-openshift-image-registry.apps.ocp.hpecloud.org left intact
```

From inside the OCP cluster, the registry is available at: `image-registry.openshift-image-registry.svc:5000`

```
$ oc get svc  -n openshift-image-registry

NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
image-registry   ClusterIP   172.30.146.74   <none>        5000/TCP   174m


$  oc get pods  -n openshift-image-registry

NAME                                               READY   STATUS    RESTARTS   AGE
cluster-image-registry-operator-68586f74b7-fphjz   1/1     Running   0          175m
image-registry-5cfcbdfccc-nlch7                    1/1     Running   0          175m
node-ca-7qsx8                                      1/1     Running   0          175m
node-ca-dxhnh                                      1/1     Running   0          175m
node-ca-g48nv                                      1/1     Running   0          175m
node-ca-t7j5r                                      1/1     Running   0          175m
node-ca-v8grr                                      1/1     Running   0          175m
```

To access the image registry logs, use the `oc logs` command:

```
$ oc logs deployments/image-registry -n openshift-image-registry

time="2019-09-26T11:28:11.62042027Z" level=info msg="start registry" distribution_version=v2.6.0+unknown go.version=go1.10.8 openshift_version=v4.2.9-201908291507+c92e458-dirty
time="2019-09-26T11:28:11.620887953Z" level=info msg="caching project quota objects with TTL 1m0s" go.version=go1.10.8
time="2019-09-26T11:28:11.621889213Z" level=info msg="redis not configured" go.version=go1.10.8
time="2019-09-26T11:28:11.621950581Z" level=info msg="Starting upload purge in 20m0s" go.version=go1.10.8
time="2019-09-26T11:28:11.636185987Z" level=info msg="using openshift blob descriptor cache" go.version=go1.10.8
time="2019-09-26T11:28:11.636230049Z" level=warning msg="Registry does not implement RempositoryRemover. Will not be able to delete repos and tags" go.version=go1.10.8
time="2019-09-26T11:28:11.637175407Z" level=info msg="Using \"image-registry.openshift-image-registry.svc:5000\" as Docker Registry URL" go.version=go1.10.8
time="2019-09-26T11:28:11.637199471Z" level=info msg="listening on :5000, tls" go.version=go1.10.8
time="2019-09-26T11:28:12.099368596Z" level=info msg=response go.version=go1.10.8 http.request.host="10.128.2.8:5000" http.request.id=b8a426d7-12eb-4471-b52c-00149c670af8 http.request.method=GET http.request.remoteaddr="10.128.2.1:47634" http.request.uri=/healthz http.request.useragent=kube-probe/1.13+ http.response.duration="58.451µs" http.response.status=200 http.response.written=0
...
```
