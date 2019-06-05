set -x
INSDIR=$PWD/../ins
rm -rf $INSDIR
mkdir $INSDIR
cp ./append-bootstrap.ign $INSDIR
cp ./install-config.yaml $INSDIR
./openshift-install create ignition-configs --dir=$INSDIR
base64 -w0 $INSDIR/master.ign >$INSDIR/master.64
base64 -w0 $INSDIR/worker.ign >$INSDIR/worker.64
base64 -w0 $INSDIR/append-bootstrap.ign >$INSDIR/append-bootstrap.64
scp $INSDIR/bootstrap.ign clh-infra:/var/www/html
