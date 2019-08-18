#! /usr/bin/env bash

xhost +SI:localuser:root

rm -f ~/ecpoint.logs
docker-compose down
docker-compose pull
docker-compose up
