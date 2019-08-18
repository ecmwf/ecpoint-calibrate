#! /usr/bin/env bash

xhost +SI:localuser:root
docker-compose pull
docker-compose up
