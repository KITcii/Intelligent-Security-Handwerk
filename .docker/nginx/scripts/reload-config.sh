#!/bin/bash

# This script is used to reload the Nginx configuration every 6 hours
while true; do
    sleep 6h;
    nginx -s reload;
done & exit 0;