_BASE=$(dirname $(dirname $(realpath $0)))

export BUN_CREATE_DIR=$_BASE/.bun-create

exec bun create debuno-dev "$@"