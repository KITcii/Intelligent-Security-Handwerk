#!/bin/sh

echo "Updating permissions for certbot files..."
chown root:www-nginx /etc/letsencrypt/live /etc/letsencrypt/archive
chmod 750 /etc/letsencrypt/live /etc/letsencrypt/archive 
chown root:www-nginx /etc/letsencrypt/archive/*/privkey*.pem 
chmod 640 /etc/letsencrypt/archive/*/privkey*.pem

exit 0