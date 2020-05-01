# Logging into the OCP cluster for the first time

Once the `site.yml` playbook has run successfully to completion, the debug output will contain details on how to access the cluster:

```
ok: [localhost] => {
    "res": {
        "changed": true,
        "cmd": "/home/core/kits/openshift-install --dir /home/core/.ocp wait-for install-complete\n",
        "delta": "0:10:59.853011",
        "end": "2019-09-26 07:37:54.920491",
        "failed": false,
        "rc": 0,
        "start": "2019-09-26 07:26:55.067480",
        "stderr": "level=info msg=\"Waiting up to 30m0s for the cluster at https://api.ocp.hpecloud.org:6443 to initialize...\"\nlevel=info msg=\"Waiting up to 10m0s for the openshift-console route to be created...\"\nlevel=info msg=\"Install complete!\"\nlevel=info msg=\"To access the cluster as the system:admin user when using 'oc', run 'export KUBECONFIG=/home/core/.ocp/auth/kubeconfig'\"\nlevel=info msg=\"Access the OpenShift web-console here: https://console-openshift-console.apps.ocp.hpecloud.org\"\nlevel=info msg=\"Login to the console with user: kubeadmin, password: UQVIT-7jBcB-VIQ9q-L2sNH\"",
        "stderr_lines": [
            "level=info msg=\"Waiting up to 30m0s for the cluster at https://api.ocp.hpecloud.org:6443 to initialize...\"",
            "level=info msg=\"Waiting up to 10m0s for the openshift-console route to be created...\"",
            "level=info msg=\"Install complete!\"",
            "level=info msg=\"To access the cluster as the system:admin user when using 'oc', run 'export KUBECONFIG=/home/core/.ocp/auth/kubeconfig'\"",
            "level=info msg=\"Access the OpenShift web-console here: https://console-openshift-console.apps.ocp.hpecloud.org\"",
            "level=info msg=\"Login to the console with user: kubeadmin, password: UQVIT-7jBcB-VIQ9q-L2sNH\""
        ],
        "stdout": "",
        "stdout_lines": []
    }
}
```

**Note**: This debug output is also logged to the `~/OpenShift-on-SimpliVity/ansible.log` file.


To log into the cluster as the `system:admin` user when using the `oc` client, issue the following commands
 using the username and password displayed. The password is also available at `~/.ocp/auth/kubeadmin-password`.

```
$ export KUBECONFIG=/home/core/.ocp/auth/kubeconfig

$ oc login -u kubeadmin -p UQVIT-7jBcB-VIQ9q-L2sNH
```

Access the web console at the URL provided in the above debug output, using the same username `kubeadmin` and password:

```
https://console-openshift-console.apps.ocp.hpecloud.org
```


