#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ECCODES_VERSION="2.7.3"
ECCODES_SRC_DIR="eccodes-${ECCODES_VERSION}-Source"
ECCODES_SRC_URL="https://software.ecmwf.int/wiki/download/attachments/45757960/${ECCODES_SRC_DIR}.tar.gz"


if [ -z "$VIRTUAL_ENV" ]; then
  INSTALL_PREFIX="$SNAPCRAFT_PART_INSTALL"
else
  INSTALL_PREFIX="$VIRTUAL_ENV"
fi


echo "Downloading eccodes v${ECCODES_VERSION} source package."
wget -q "$ECCODES_SRC_URL"

echo "Extracting $DIR/${ECCODES_SRC_DIR}.tar.gz"
tar -xzf  "$DIR/${ECCODES_SRC_DIR}.tar.gz"

mkdir "$DIR/eccodes-build"
pushd "$DIR/eccodes-build"
cmake -DCMAKE_INSTALL_PREFIX="$INSTALL_PREFIX" -DCMAKE_BUILD_TYPE=Release "../$ECCODES_SRC_DIR"
make -j$(nproc)
make install -j$(nproc)
popd

rm "$DIR/${ECCODES_SRC_DIR}.tar.gz"
rm -Rf "$DIR/eccodes-build" "$DIR/${ECCODES_SRC_DIR}"
