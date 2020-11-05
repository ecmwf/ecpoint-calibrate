#! /usr/bin/env sh

rm -f /var/tmp/ecpoint.logs
touch /var/tmp/ecpoint.logs
npx frontail --disable-usage-stats -l 1000 /var/tmp/ecpoint.logs
