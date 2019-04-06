#!/bin/sh

NODE=/opt/node-v8.15.1-linux-armv6l/bin/node
CAPSH=~weather/libcap/progs/capsh

$CAPSH --caps='cap_setpcap,cap_setgid,cap_setuid+ep cap_net_bind_service+eip' \
       --keep=1 \
       --user=weather \
       --addamb=cap_net_bind_service \
       -- -c "$NODE src/index.js"
