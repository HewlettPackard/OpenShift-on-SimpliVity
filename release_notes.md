# Bug Fixes

## Loadbalancers: firewall zone settings lost after a reboot
After a reboot, the two interfaces of the loadbalancers are now assigned to the correct firewall zones

## dns and dhcp services not automatically restart acfter a reboot of a support node
This is now fixed.

# OCP 4.2 support

## Scaling with RHCOS worker nodes
- OCP 4.2 requires to approve two CSRs whenever a worker node is added to the cluster. the scale.yml playbook was modified to approve these CSRs

## Make the master nodes non-schedulable
- By default, the OCP 4.2 installer generates Kubernetes manifests which will make the master nodes schedulable. This was done in an attempt to support clusters with smaller footprints. However due to a limitation with Kubernetes where router Pods running on control plane machines will not be reachable by the ingress load balancer a manifest needs to be modified prior to the actual installation in order to make the master nodes non-schedulable. According to Red Hat, this may be corrected in a future minor version of OCP.

