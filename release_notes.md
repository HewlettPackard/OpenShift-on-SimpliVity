# Release Notes

## Bug Fixes

### Load balancers: firewall zone settings are lost after a reboot

- After a reboot, the two interfaces of the load balancer VMs are now assigned to the correct firewall zones.

### DNS and DHCP services are not automatically restarted after a reboot of a support node

- These services are now started automatically after a reboot.
