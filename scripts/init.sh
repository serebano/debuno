#!/bin/sh

_BASE=$(dirname $(dirname $(realpath $0)))

export BUN_CREATE_DIR=$_BASE/.bun-create
_PROJECT_NAME="${1:-debuno}"

bun create debuno $_PROJECT_NAME
cd $_PROJECT_NAME
# debuno link
bun run dev