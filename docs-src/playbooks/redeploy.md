# Redeployment


The playbook `playbooks/clean.yml` is a convenience playbook for stripping down a cluster. This can be very useful 
in a proof-of-concept environment, where you may want to regularly tear down and re-deploy your test cluster.

- Delete the install directory, typically `~/.ocp/`
- Set the value of the variable `delete_templates` to `false` if you don't want your templates to be deleted
- Run the playbook `playbooks/clean.yml`:

    ```
    $ cd ~/OpenShift-on-SimpliVity
    
    $ ansible-playbook -i hosts playbooks/clean.yml --vault-password-file .vault_pass
    ```

The playbook will un-register any Red Hat systems from the Red Hat Network and then delete VMs and templates.
