# Introduction to backup and restore



`etcd` is the key-value store for OpenShift Container Platform, which persists the state of all resource objects.
It is highly recommended that you back up your cluster’s etcd data regularly and store in a secure location, ideally
outside the OpenShift Container Platform environment. Do not take an etcd backup before the first certificate rotation
completes, which occurs 24 hours after installation, otherwise the backup will contain expired certificates. After the
initial certificate rotation, rotation occurs about every 15 days or so thereafter and the certificates that are being
rotated have an expiration of approximately 30 days. So it is recommended that you backup etcd every 2.5 weeks.

It is also recommended to take etcd backups during non-peak usage hours, as it is a blocking action.

