#!/bin/sh

/usr/sbin/sshd -D -e &

dockerd-entrypoint.sh "$@"
