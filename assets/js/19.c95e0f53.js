(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{228:function(t,e,a){"use strict";a.r(e);var l=a(0),s=Object(l.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"openshift-configuration"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#openshift-configuration","aria-hidden":"true"}},[t._v("#")]),t._v(" OpenShift configuration")]),t._v(" "),a("p",[t._v("All the variables are mandatory, unless otherwise stated.")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("Variable")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("File")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("local_home")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Local user's HOME directory. Defaults to the "),a("code",[t._v("HOME")]),t._v(" environment variable")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("ocp_installer_path")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Path to the downloaded OCP installer. Defaults to "),a("code",[t._v("<<local_home>>/kits/openshift-install")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("ocp_oc_path")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Path to the downloaded "),a("code",[t._v("oc")]),t._v(" client. Defaults to "),a("code",[t._v("<<local_home>>/kits/oc")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("ocp_kubectl_path")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Path to the downloaded "),a("code",[t._v("kubectl")]),t._v(" client. Defaults to "),a("code",[t._v("<<local_home>>/kits/kubectl")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("vault.pull_secret")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[a("strong",[t._v("group_vars/all/vault.yml")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("The pull secret obtained from Red Hat installation web page")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("install_dir")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("The directory where files that are generated as part of the OCP installation will be saved. If you are re-running the playbooks after a previous deployment, you should delete any existing content in this folder first. Defaults to "),a("code",[t._v("<<local_home>>/.ocp")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("master_ova_path")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Path to RHCOS OVA for master nodes. Defaults to "),a("code",[t._v("~/kits/rhcos-4.1.0-x86_64-vmware.ova")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("worker_ova_path")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Path to RHCOS OVA for worker nodes. Defaults to same value as "),a("code",[t._v("master_ova_path")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("master_template")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Name of template generated from master OVA. Defaults to "),a("code",[t._v("hpe-rhcos")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("worker_template")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Name of template generated from worker OVA. Uses the same value as "),a("code",[t._v("master_template")]),t._v(" if the same OVA is used for both master and worker nodes.")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("infra_template")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("The template used to create infrastructure machines including the load balancers, NFS and nodes hosting DNS and DHCP services. If this value is not present, the playbooks will use the infrastructure OVA specified by "),a("code",[t._v("infra_ova_path")]),t._v(". Defaults to "),a("code",[t._v("hpe-rhel760")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("infra_ova_path")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Instead of specifiying a template for infrastructure machines, you can  use an OVA instead.  Defaults to "),a("code",[t._v("~/kits/hpe-rhel760.ova")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("infra_folder")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("group_vars/all/vars.yml")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("This folder is created (if it does not already exist) for the non-OCP VMs and templates. Defaults to "),a("code",[t._v("hpeInfra")])])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[a("code",[t._v("vault.ssh_key")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[a("strong",[t._v("group_vars/all/vault.yml")])]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("The public SSH key for the "),a("code",[t._v("core")]),t._v(" user")])])])])])}),[],!1,null,null,null);e.default=s.exports}}]);