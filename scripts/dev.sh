#!/bin/sh
_BASE=$(dirname $(dirname $(realpath $0)))

exec bun run dev "$@"
