#! /usr/bin/env bash

xhost +SI:localuser:root
docker run -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix --privileged ecpoint
