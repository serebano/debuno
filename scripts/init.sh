_BASE=$(dirname $(dirname $(realpath $0)))

export BUN_CREATE_DIR=$_BASE/.bun-create
_PROJECT_NAME="${1:-debuno-dev}"

bun create debuno-dev $_PROJECT_NAME
cd $_PROJECT_NAME
debuno link
debuno dev