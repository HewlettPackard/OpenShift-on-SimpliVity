# Build and deploy an application 

In this example, you will see how to build an image from source code, and then store it in the registry and use that image
when deploying an application in the cluster.


As a prerequisite, you should provide a route for the image registry as outlined in the section [Exposing the image registry](expose-registry). You should also install a program that allows you to build images, for example, `podman` or `docker`. To install `podman` on Fedora:

```
$ dnf install -y podman
```

For more information on `podman`, see the RedHat article
[Podman and Buildah for Docker users](https://developers.redhat.com/blog/2019/02/21/podman-and-buildah-for-docker-users/).

## Build the image

This example takes a simple NodeJS web application and builds an image using `podman`. Download the sample from GitHub: 

```
$ cd 

$ git clone https://github.com/gabrielmcg/helloworld-nodejs

$ cd helloworld-nodejs
```

The program creates a trivial web server and responds with the message "Hello World" when a user accesses the home page.
The following excerpt from `index.js` shows the primary components of the application:

```
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("Hello world received a request.");

  const target = process.env.TARGET || "World";
  res.send(`Hello ${target}!`);

});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Hello world listening on port", port);
});

```

The accompanying `Dockerfile` builds an image based on the official `node:10` image, installs dependencies, copies in the source code and starts the webserver. You can use the `podman` or `docker` command, depending on your setup, to build the image.

```
$ podman build -t helloworld:v1 .

STEP 1: FROM node:10
STEP 2: WORKDIR /usr/src/app
9f57296b3b50125d693af6f559d671d3a577a5f3ba07f9dc752d229709411cbb
STEP 3: COPY package*.json ./
bd2ec027a14617a9cdbbadc9d3b8f3f55fd29611dda6e49d403e667d1ffe8c5e
STEP 4: RUN npm install --only=production
npm WARN helloworld-nodejs@1.0.0 No description
npm WARN helloworld-nodejs@1.0.0 No repository field.

added 48 packages from 36 contributors and audited 121 packages in 1.064s
found 0 vulnerabilities

153a13d7ff2f69fa76d82bb9561ffdbe09fe29b3ddf490f07efde963922c2daf
STEP 5: COPY . .
02a99699b19f7c1ae2cfa4ebf9653a15281d5fb757ab2c877fc287d5df812916
STEP 6: ENV PORT 8080
1b6e214c8f29a74124098c994ad9eb32ef970e1525c03dc7aa346e4dffda7ea7
STEP 7: CMD [ "npm", "start" ]
STEP 8: COMMIT helloworld:v1
3d05913e32f639e9d80f402e32c53be9471687b74fb5ff8e3c30353b0c835b41
```

Check that the image has been created locally:

```
$ podman images

REPOSITORY                                 TAG      IMAGE ID       CREATED        SIZE
localhost/helloworld                       v1       3d05913e32f6   17 hours ago   935 MB

```


## Create the project
Create a new project named `helloworld`:

```
$ oc new-project helloworld


Now using project "helloworld" on server "https://api.ocp.hpecloud.org:6443".

You can add applications to this project with the 'new-app' command. For example, try:

    oc new-app django-psql-example

to build a new example application in Python. Or use kubectl to deploy a simple Kubernetes application:

    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
```

# Tag and push the image

Tag the image before pushing to the local image registry, using the default route created earlier in the section
[Exposing the image registry](expose-registry):

```
$ podman tag helloworld:v1 default-route-openshift-image-registry.apps.ocp.hpecloud.org/helloworld/helloworld:v1
```

Log in to the local registry:


```
$ podman login -u kubeadmin -p $(oc whoami -t) default-route-openshift-image-registry.apps.ocp.hpecloud.org --tls-verify=false

Login Succeeded!
```

Push the image to the local registry:

```
$ podman push  default-route-openshift-image-registry.apps.ocp.hpecloud.org/helloworld/helloworld:v1 --tls-verify=false

Getting image source signatures
Copying blob 553039093d83 done
Copying blob 73bfa217d66f done
Copying blob 91ecdd7165d3 done
Copying blob e4b20fcc48f4 done
Copying blob 5f3a5adb8e97 done
Copying blob 2e517d68c391 done
Copying blob 291f8a573386 done
Copying blob 10a2b00f2be1 done
Copying blob 86135eafe3c7 done
Copying blob 3d8956424ab7 done
Copying blob d51a74fa5b42 done
Copying blob 8186e77df3b5 done
Copying config 3d05913e32 done
Writing manifest to image destination
Copying config 3d05913e32 done
Writing manifest to image destination
Storing signatures
```

## Deploy the application

Deploy the application to the cluster:

```
$ kubectl create deployment helloworld --image=image-registry.openshift-image-registry.svc:5000/helloworld/helloworld:v1

deployment.apps/helloworld created
```

Wait for the application to be ready:

```
$ oc get deploy
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
helloworld   0/1     1            0           19s

$ oc get pods
NAME                         READY   STATUS              RESTARTS   AGE
helloworld-d7f944d95-xlg88   0/1     ContainerCreating   0          24s


$ oc get pods
NAME                         READY   STATUS    RESTARTS   AGE
helloworld-d7f944d95-xlg88   1/1     Running   0          38s
```

Check the logs for this pod to ensure that the appication started successfully:

```
$ oc logs helloworld-d7f944d95-xlg88

> helloworld-nodejs@1.0.0 start /usr/src/app
> node index.js

Hello world listening on port 8080
```

## Access the application

Create a service for the application:

```
$ oc expose deploy helloworld --port 8080
service/helloworld exposed

$ oc get svc
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
helloworld   ClusterIP   172.30.110.14   <none>        8080/TCP   5s
```

Test access to the service. First, establish a debug session on one of your nodes:

```
$ oc debug nodes/ocp-master1

Starting pod/ocp-master1-debug ...
To use host binaries, run `chroot /host`
Pod IP: 10.15.155.211
If you don't see a command prompt, try pressing enter.
sh-4.2#
```

Use the `curl` command from the debug session to test access to the service from inside the cluster. You should see the message `Hello World` displayed as a result of accessing the home page:

```
sh-4.2# curl 172.30.110.14:8080

Hello World!

sh-4.2# exit
```

## Access from outside the cluster

Create a route to provide access from outside the cluster:

```
$ oc expose svc/helloworld --name=helloworld
route.route.openshift.io/helloworld exposed

$ oc get route
NAME         HOST/PORT                                     PATH   SERVICES     PORT   TERMINATION   WILDCARD
helloworld   helloworld-helloworld.apps.ocp.hpecloud.org          helloworld   8080                 None
```

You should now be able to access the application using this route from outside the cluster, for example, from your Ansible controller:

```
$ curl helloworld-helloworld.apps.ocp.hpecloud.org

Hello World!
```


## Known issue

**Note:** When you create the project, you are informed that you can use either `oc new-app` or `kubectl deploy`:

```
$ oc new-project helloworld

Now using project "helloworld" on server "https://api.ocp.hpecloud.org:6443".

You can add applications to this project with the 'new-app' command. For example, try:

    oc new-app django-psql-example

to build a new example application in Python. Or use kubectl to deploy a simple Kubernetes application:

    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
```

It is possible that if you use the `oc new-app` option, you may enocunter an issue relating to certificates:

```
$ oc new-app default-route-openshift-image-registry.apps.ocp.hpecloud.org/helloworld/helloworld

W1205 11:08:19.556016     991 dockerimagelookup.go:236] container image registry lookup failed: Get https://default-route-openshift-image-registry.apps.ocp.hpecloud.org/v2/: x509: certificate signed by unknown authority
error:  local file access failed with: stat default-route-openshift-image-registry.apps.ocp.hpecloud.org/helloworld/helloworld: no such file or directory
error: unable to locate any images in image streams, templates loaded in accessible projects, template files, local docker images with name "default-route-openshift-image-registry.apps.ocp.hpecloud.org/helloworld/helloworld"
```




