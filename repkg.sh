#/bin/bash
if [ $# -ne 1 ]
then
    echo "Usage: $0 <AppImage name>"
    exit 1
fi
cd pkg
rm -r squashfs-root
echo "Repackaging $1"
./$1 --appimage-extract
sed -i 's/exec "$BIN"/exec "$BIN" --no-sandbox/g' squashfs-root/AppRun
appimagetool squashfs-root $1
