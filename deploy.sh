#! /usr/bin/env bash

version=$(node -p "require('./package.json').version")

docker build -f Dockerfile.core -t oldreliabletech/ecpoint-calibrate-core:$version .
docker build -f Dockerfile.logger -t oldreliabletech/ecpoint-calibrate-logger:$version .

docker push docker.io/oldreliabletech/ecpoint-calibrate-core:$version
docker push docker.io/oldreliabletech/ecpoint-calibrate-logger:$version
