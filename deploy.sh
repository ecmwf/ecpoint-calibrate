#! /usr/bin/env bash

version=$(node -p "require('./package.json').version")

docker build -f Dockerfile.core -t onyb/ecpoint-calibrate-core:$version .
docker build -f Dockerfile.logger -t onyb/ecpoint-calibrate-logger:$version .

docker push docker.io/onyb/ecpoint-calibrate-core:$version
docker push docker.io/onyb/ecpoint-calibrate-logger:$version
