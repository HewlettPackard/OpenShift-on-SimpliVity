(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{217:function(e,a,t){"use strict";t.r(a);var n=t(0),r=Object(n.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"high-availability"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#high-availability","aria-hidden":"true"}},[e._v("#")]),e._v(" High availability")]),e._v(" "),t("p",[e._v("Anti-affinity rules are created to ensure that VMs performing the same role are kept apart and run on different\nunderlying ESXi hosts.")]),e._v(" "),t("h2",{attrs:{id:"control-plane"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#control-plane","aria-hidden":"true"}},[e._v("#")]),e._v(" Control plane")]),e._v(" "),t("p",[e._v("The default configuration for the solution is three master nodes running on three separate ESXi hosts. The control plane VMs  are kept apart using an anti-affinity rule named")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("{{cluster_name}}-master-anti-affinity-rule-001\n")])])]),t("p",[e._v("where "),t("code",[e._v("cluster_name")]),e._v(" is the name of your cluster, as defined in the vars file.")]),e._v(" "),t("h2",{attrs:{id:"deploying-two-infrastructure-nodes"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#deploying-two-infrastructure-nodes","aria-hidden":"true"}},[e._v("#")]),e._v(" Deploying two infrastructure nodes")]),e._v(" "),t("p",[e._v("You can configure the internal DNS and DHCP services to run on two virtual machines to provide redundancy. These two VMs are guaranteed  to run on  two different ESXi hosts through using an anti-affinity rule named")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("{{cluster_name}}-infrastructure-anti-affinity-rule-001\n")])])]),t("p",[e._v("where "),t("code",[e._v("cluster_name")]),e._v(" is the name of your cluster, as defined in the vars file.")]),e._v(" "),t("h2",{attrs:{id:"deploying-two-load-balancers"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#deploying-two-load-balancers","aria-hidden":"true"}},[e._v("#")]),e._v(" Deploying two load balancers")]),e._v(" "),t("p",[e._v("You can configure the playbooks to deploy  two load balancers in an active-active configuration to provide highly-available access. These nodes run "),t("code",[e._v("keepalived")]),e._v(" and HAproxy. The load balancers are hosted on two VMs that are guaranteed to run on  two different ESXi host through using an anti-affinity rule named")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("{{cluster_name}}-loadbalancer-anti-affinity-rule-001\n")])])]),t("p",[e._v("where "),t("code",[e._v("cluster_name")]),e._v(" is the name of your cluster, as defined in the vars file.")])])}),[],!1,null,null,null);a.default=r.exports}}]);