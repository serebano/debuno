_BASE=$(dirname $(dirname $(realpath $0)))
_VERSION=$(jq -r '.version' $_BASE/package.json)

echo $_VERSION