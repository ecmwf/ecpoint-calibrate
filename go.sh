#! /usr/bin/env bash

xhost +SI:localuser:root

if [ -z "$no_proxy" ] ; then
  export no_proxy="core"
else
  export no_proxy="core,$no_proxy"
fi

rm -f ~/ecpoint.logs
docker-compose down
docker-compose pull
docker-compose up
