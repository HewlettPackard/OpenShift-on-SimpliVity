(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{193:function(e,n,t){e.exports=t.p+"assets/img/nginx-example-backend.35cea66d.png"},232:function(e,n,t){"use strict";t.r(n);var a=t(0),o=Object(a.a)({},(function(){var e=this,n=e.$createElement,a=e._self._c||n;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"deploy-example-application"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#deploy-example-application","aria-hidden":"true"}},[e._v("#")]),e._v(" Deploy example application")]),e._v(" "),a("p",[e._v("Create a new project (namespace).")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('$ oc new-project my-nginx-example\n\nNow using project "my-nginx-example" on server "https://api.ocp.hpecloud.org:6443".\n\nYou can add applications to this project with the \'new-app\' command. For example, try:\n\n    oc new-app django-psql-example\n\nto build a new example application in Python. Or use kubectl to deploy a simple Kubernetes application:\n\n    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node\n\n')])])]),a("p",[e._v("Deploy a new application:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('$ oc new-app --template=openshift/nginx-example --name=my-nginx-example --param=NAME=my-nginx-example\n\n--\x3e Deploying template "openshift/nginx-example" for "openshift/nginx-example" to project my-nginx-example\n\n     Nginx HTTP server and a reverse proxy\n     ---------\n     An example Nginx HTTP server and a reverse proxy (nginx) application that serves static content. For more information about using this template, including OpenShift considerations, see https://github.com/sclorg/nginx-ex/blob/master/README.md.\n\n     The following service(s) have been created in your project: my-nginx-example.\n\n     For more information about using this template, including OpenShift considerations, see https://github.com/sclorg/nginx-ex/blob/master/README.md.\n\n     * With parameters:\n        * Name=my-nginx-example\n        * Namespace=openshift\n        * NGINX Version=1.12\n        * Memory Limit=512Mi\n        * Git Repository URL=https://github.com/sclorg/nginx-ex.git\n        * Git Reference=\n        * Context Directory=\n        * Application Hostname=\n        * GitHub Webhook Secret=n2RnraoYqYKWwWSOxmHXodDThyL8qOwLXqRyYWbU # generated\n        * Generic Webhook Secret=nLGGtYKDupWHq4yCqUg5EiWRtVKV4e3lxEEsfDup # generated\n\n--\x3e Creating resources ...\n    service "my-nginx-example" created\n    route.route.openshift.io "my-nginx-example" created\n    imagestream.image.openshift.io "my-nginx-example" created\n    buildconfig.build.openshift.io "my-nginx-example" created\n    deploymentconfig.apps.openshift.io "my-nginx-example" created\n--\x3e Success\n    Access your application via route \'my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org\'\n    Build scheduled, use \'oc logs -f bc/my-nginx-example\' to track its progress.\n    Run \'oc status\' to view your app.\n')])])]),a("p",[e._v("The output shows that a service and route have been created for the application, and tells you to use the "),a("code",[e._v("oc status")]),e._v(" command to check your application:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("$ oc status\nIn project my-nginx-example on server https://api.ocp.hpecloud.org:6443\n\nhttp://my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org (svc/my-nginx-example)\n  dc/my-nginx-example deploys istag/my-nginx-example:latest <-\n    bc/my-nginx-example source builds https://github.com/sclorg/nginx-ex.git on openshift/nginx:1.12\n    deployment #1 deployed 23 minutes ago - 1 pod\n")])])]),a("p",[e._v("The details of the service can be obtained using the "),a("code",[e._v("oc get svc")]),e._v(" command:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("$ oc get svc my-nginx-example\nNAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE\nmy-nginx-example   ClusterIP   172.30.155.90   <none>        8080/TCP   3m26s\n")])])]),a("p",[e._v("The route created for the example application  uses the application name "),a("code",[e._v("my-nginx-example")]),e._v(",\nthe cluster name "),a("code",[e._v("ocp")]),e._v(" and the domain name "),a("code",[e._v("hpecloud.org")]),e._v(".")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("$ oc get route my-nginx-example\n\nNAME               HOST/PORT                                                 PATH   SERVICES           PORT    \nmy-nginx-example   my-nginx-example-my-nginx-example.apps.ocp.hpecloud.org          my-nginx-example   <all>       \n")])])]),a("p",[e._v("Use the route in your browser to access the application:")]),e._v(" "),a("p",[a("img",{attrs:{src:t(193),alt:'"Nginx example - backend network"',title:"Figure. Nginx example - backend network"}})]),e._v(" "),a("p",[a("strong",[e._v("Figure. Nginx example - backend network")])])])}),[],!1,null,null,null);n.default=o.exports}}]);