#!/bin/sh
_BASE=$(dirname $(realpath $0))

function parse_version { echo "$@" | awk -F. '{ printf("%d%03d%03d%03d\n", $1,$2,$3,$4); }'; }

installed_version=$($_BASE/version.sh)
installed_version_number=$(parse_version $installed_version)

latest_version=$(curl -s https://debuno.dev/version)
latest_version_number=$(parse_version $latest_version)

_INSTALL_DIR=$(dirname $_BASE)


function install() {


    #$HOME/.debuno
    _BIN_DIR=$_INSTALL_DIR/bin
    _BIN=$_BIN_DIR/debuno



    echo "Current version: $installed_version ($_INSTALL_DIR)"
    echo "Installing version: $latest_version (https://debuno.dev/version)"
    echo



    rm -rf $_INSTALL_DIR
    git clone https://github.com/serebano/debuno.git $_INSTALL_DIR

    # _BIN_LINK=$HOME/.deno/bin/debuno
    # if [ -L $_BIN_LINK ]; then rm $_BIN_LINK; fi
    # ln -s $_BIN $_BIN_LINK;

    echo
    echo "Upgraded: $($_BIN -v) $_INSTALL_DIR"
}

if [ $latest_version_number -gt $installed_version_number -o "$1" == "-f" ]; then
    install;
else
    echo "Local debuno version $installed_version ($_INSTALL_DIR) is the most recent release"
fi;