# Issues fixed in this release

- **Load balancers: firewall zone settings were lost after a reboot**

  After a reboot, the two interfaces of the load balancer VMs are now assigned to the correct firewall zones.


- **DNS and DHCP services were not automatically restarted after a reboot of a support node**

  These services are now started automatically after a reboot.

- **Cluster deployment could fail waiting for operators to be available**

  After a successful bootstrap of the OCP cluster, the deployment could fail if all operators were not ready after a certain amount of time (10 mins). However, this was not necessarily a fatal error and could happen with the cluster under heavy load. The playbooks now continue after waiting for the operators and rely on the OCP installer to ensure that the deployment has completed successfully.