_BASE=$(dirname $(dirname $(realpath $0)))

jq '.version' $_BASE/package.json