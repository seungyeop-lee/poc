#!/bin/sh

[ ! -d '/tmp/cache' ] && mkdir -p /tmp/cache

HOSTNAME="0.0.0.0" node server.js
