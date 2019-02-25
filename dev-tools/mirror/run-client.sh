#!/bin/sh

/home/linux/usr/bin/mirror \
    client --include '.vscode/' \
    -h 192.168.1.26 -l /mnt/c/src/Euclid -r \
    /home/david/usr/src/Euclid
