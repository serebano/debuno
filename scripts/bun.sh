#!/bin/sh
_BASE=$(dirname $(dirname $(realpath $0)))

exec bun --preload $_BASE/index.js "$@"
