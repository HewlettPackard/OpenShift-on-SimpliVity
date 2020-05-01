# Deploying RHEL worker nodes

Red Hat Enterprise Linux (RHEL) worker nodes can only be deployed after the OpenShift control plane has been
successfully deployed and once the OCP cluster is up and running.


::: warning
If you choose to use RHEL compute machines in your cluster, you take responsibility for all operating system life cycle management and maintenance, including performing system updates, applying patches, and completing all other required tasks.
:::

::: warning
Only RHEL 7.6 is supported in OpenShift Container Platform 4.2. You must not upgrade your compute machines to RHEL 8.
:::

## System requirements for RHEL compute nodes

RHEL compute nodes in your OpenShift Container Platform environment must meet the following minimum hardware specifications and system-level requirements.

- You must have active `OpenShift Container Platform` and `Red Hat Enterprise Linux Server` subscriptions associated with your Red Hat Network account. 

- Production environments must provide compute resources to support your expected application workloads. As an OpenShift Container Platform cluster administrator, you must calculate the resource requirements for your expected workload and add about 10 percent for overhead. For production environments, be sure to allocate enough resources so that your OCP cluster can survive a node failure event without affecting your running applications.


## Running the playbooks

There are a number of steps for deploying RHEL worker nodes:

- Download Red Hat Ansible playbooks to the folder `~/openshift-ansible` folder
- Run the HPE playbook `playbooks/scale.yml` in the `~/OpenShift-on-SimpliVity` to provision the RHEL VMs
- Run a Red Hat Ansible playbook to add the RHEL nodes to the OCP cluster.

### Download Red Hat Ansible playbooks
The Red Hat OpenShift ansible playbooks are available at [https://github.com/openshift/openshift-ansible](https://github.com/openshift/openshift-ansible). For OpenShift 4.x, this repository only provides playbooks necessary for scaling up or upgrading RHEL hosts in an existing 4.x cluster.

::: warning
The required  Red Hat `openshift-ansible` playbooks change regularly. HPE has no control on these playbooks and therefore recommends that you use a specific version of the playbooks rather than the latest version  on the master branch. At the time of  writing, the `4.2.2-201910250432` version of the Red Hat `openshift-ansible` playbooks  have been tested and certified with this solution.
::: 

Clone the  release of the `openshift-ansible` playbooks that has been tagged `openshift-ansible-4.2.2-201910250432`
into the home directory of the `core` user on the Ansible controller node:

```
$ cd
$ git clone --branch openshift-ansible-4.2.2-201910250432 https://github.com/openshift/openshift-ansible.git
```

Ensure that the `ocp_repo_directory` variable in `group_vars/all/vars.yml` accurately reflects the location of the cloned
`openshift-ansible` playbooks. By default, this parameter is set to: `<<local_home>>/openshift-ansible` so it should not
require modification if the playbooks were cloned in the `core` user's home directory.

### Running playbooks/scale.yml to provision the RHEL VMs

-   Modify your `hosts` inventory file to add one or more entries in  the `[rhel_worker]` group. For example, in the extract from the  `hosts` file below,  the `ocp-worker4` node will be added as a RHEL worker:

    ```
    [rhcos_worker]
    ocp-worker0   ansible_host=10.15.155.213 
    ocp-worker1   ansible_host=10.15.155.214
    ocp-worker2   ansible_host=10.15.155.215 
    ocp-worker3   ansible_host=10.15.155.216 

    [rhel_worker]
    ocp-worker4   ansible_host=10.15.155.217
    ```

-   Ensure that the value of the `template` variable in the group variables file `group_vars/rhel_worker.yml` is set to the name of your RHEL 7.6 template. Alternatively, set the `ova_path` variable in the same group file to the location of your RHEL 7.6 OVA file. The `template` variable will take precedence over the `ova_path` variable if both are present.

    ```
    template: ocp-rhel760              # Override the default template
    ova_path: ~/kits/ocp-rhel760.ova    # Name of the OVA used to import the template
    ```
-   Run the playbooks/scale.yml file

    ```
    $ cd ~/OpenShift-on-SimpliVity
    $ ansible-playbook -i hosts playbooks/scale.yml --vault-password-file .vault_pass
    ```

**Note:** Running this playbook will generate an inventory file called `inventory.scale` in the  `~/openshift-ansible` folder, so that folder must be present before running the `playbooks/scale.yml` playbook. 


### Run the Red Hat Ansible playbook `scaleup.yml`

Deploy the RHEL worker node(s) by invoking the `playbooks/scaleup.yml` playbook in the `openshift-ansible` directory:

```
$ cd ~/openshift-ansible
$ ansible-playbook -i inventory.scale playbooks/scaleup.yml
```

Verify that the newly created RHEL worker node `ocp-worker4` has joined the cluster:


```
$ oc get nodes -o wide

NAME          STATUS   ROLES    AGE    VERSION             INTERNAL-IP     EXTERNAL-IP     OS-IMAGE                                                   KERNEL-VERSION               CONTAINER-RUNTIME
ocp-master0   Ready    master   10d    v1.14.6+c7d2111b9   10.15.155.210   10.15.155.210   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-master1   Ready    master   10d    v1.14.6+c7d2111b9   10.15.155.211   10.15.155.211   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-master2   Ready    master   10d    v1.14.6+c7d2111b9   10.15.155.212   10.15.155.212   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-worker0   Ready    worker   10d    v1.14.6+c7d2111b9   10.15.155.213   10.15.155.213   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-worker1   Ready    worker   10d    v1.14.6+c7d2111b9   10.15.155.214   10.15.155.214   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-worker2   Ready    worker   8d     v1.14.6+c7d2111b9   10.15.155.215   10.15.155.215   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-worker3   Ready    worker   8d     v1.14.6+c7d2111b9   10.15.155.216   10.15.155.216   Red Hat Enterprise Linux CoreOS 42.81.20191107.0 (Ootpa)   4.18.0-147.el8.x86_64        cri-o://1.14.11-0.23.dev.rhaos4.2.gitc41de67.el8
ocp-worker4   Ready    worker   7d3h   v1.13.4+509f0153f   10.15.155.217   10.15.155.217   OpenShift Enterprise                                       3.10.0-1062.7.1.el7.x86_64   cri-o://1.14.11-0.17.dev.rhaos4.2.gitc41de67.el7

```


**Note:** It can take 10 to 15 minutes to deploy two Red Hat Enterprise Linux worker nodes.


