
#USERNAME=$(whoami)
#GRPNAME=$(id -gn)
#
USERNAME=apache
GRPNAME=apache

mkdir -p $CVM_LARGEDATA_DIR
chown -R $USERNAME:$GRPNAME $CVM_LARGEDATA_DIR
chmod -R 755 $CVM_LARGEDATA_DIR
find $CVM_LARGEDATA_DIR -type f -exec chmod 644 {} \;

