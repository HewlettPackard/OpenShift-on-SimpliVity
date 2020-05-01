# Sysdig integration

## Introduction to Sysdig

The Sysdig Secure DevOps Platform converges security and compliance with performance and capacity monitoring to create a secure DevOps workflow. It is comprised of two main products:

- **Sysdig Secure:** Allows you to efficiently resolve vulnerabilities, block threats at runtime and respond to incidents quickly — and be confident about your Kubernetes security.
- **Sysdig Monitor:** Helps you deliver the performance and availability your users expect via context-based monitoring — and manage the risk, health and performance of your microservices.


This solution focuses on the monitoring functionality and the Sysdig integration allows you to:

- Simplify discovery and metric collection
- Visualize service reliability
- Monitor infrastructure and applications
- Build robust dashboards
- Simplify and scale Prometheus monitoring
- Proactively alert for faster response

By default, you must have outgoing port `6666` open in your firewall, to allow data to flow to `collector.sysdigcloud.com`.
You can configure the agent to use a different port using the variable sysdig_collector_port in `group_vars/all/vars.yml`.
For more information, see the relevant Sysdig documentation at
[https://support.sysdig.com/hc/en-us/articles/204205969](https://support.sysdig.com/hc/en-us/articles/204205969).

If you are using a proxy, it must be configured to be "fully-transparent". Non-transparent proxies will not 
allow the agent to connect.



## Sysdig configuration

The following table defines the variables used for configuring the Sysdig deployment on OpenShift.


|Variable|File|Description|
|:-------|:---|:----------|
|`vault.sysdig_access_key`|**group_vars/all/vault.yml**|After the activation of your account on the Sysdig portal, you will be provided with your access key which will be used by the playbooks to install the agent on cluster nodes.|
|`sysdig_k8s_cluster_name`|group_vars/all/vars.yml|Setting cluster name allows you to view, scope, and segment metrics in the Sysdig Monitor UI by OpenShift cluster.|
|`sysdig_tags`|group_vars/all/vars.yml|Tagging your hosts is highly recommended. Tags allow you to sort the nodes of your infrastructure into custom groups in Sysdig Monitor. Specify location, role, and owner in the format: `'location:City,role:OpenShift,owner:Customer Name'`|
|`sysdig_collector`|group_vars/all/vars.yml|The URL for the Sysdig SaaS, by default, `'collector.sysdigcloud.com'`|
|`sysdig_collector_port`|group_vars/all/vars.yml|The port used by the agent, by default,  `'6666'`|
|`sysdig_ssl`|group_vars/all/vars.yml|Optional. Defaults to `True`|
|`sysdig_ssl_verify_certificate`|group_vars/all/vars.yml|Optional. Defaults to `True`|
|`sysdig_new_k8s`|group_vars/all/vars.yml|Optional. Defaults to `True`. Allows kube state metrics to be automatically detected, monitored, and displayed in Sysdig Monitor.|


## Using the Sysdig playbook

The playbook deploys the Sysdig Agent software
on all nodes in your OpenShift cluster, with captured data being relayed back to your Sysdig SaaS Cloud portal.

Once you have configured the relevant variable for Sysdig, you can run the playbook as follows:

```
$ cd ~/OpenShift-on-SimpliVity

$ ansible-playbook -i hosts playbooks/sysdig.yml --vault-password-file .vault_pass
```


Using the Sysdig software as a solution (SaaS) website [https://app.sysdigcloud.com](https://app.sysdigcloud.com),
you are able to view, analyze and inspect various different dashboards. Initially, you will just see the monitoring
information for the infrastructure itself. Deploy a sample application and then use the Sysdig solution to analyze the
different facets of the deployed application.