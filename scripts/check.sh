#!/bin/sh
_BASE=$(dirname $(dirname $(realpath $0)))

function debuno_cli { $_BASE/bin/debuno $@; }
function parse_version { echo "$@" | awk -F. '{ printf("%d%03d%03d%03d\n", $1,$2,$3,$4); }'; }

installed_version=$(debuno_cli -v)
installed_version_number=$(parse_version $installed_version)

latest_version=$(curl -s https://debuno.dev/version)
latest_version_number=$(parse_version $latest_version)

if [ $latest_version_number -gt $installed_version_number ]; then
    echo "  Upgrade available:"
    echo "      Installed version: $installed_version"
    echo "      Latest version: $latest_version"
    echo "      Run 'debuno upgrade' to upgrade"
fi