#!/bin/sh
_BASE=$(dirname $(dirname $(realpath $0)))

exec node --import $_BASE/index.js --enable-source-maps "$@"
