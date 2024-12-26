#!/bin/sh

_SELF=$(realpath $0)
_BASE=$(dirname $_SELF)
_DENO=$HOME/.deno
_BIN=$_DENO/bin/debuno
_RUN=$_BASE/run.sh

# echo "_SELF: $_SELF"
# echo "_BASE: $_BASE"
# echo "_BIN: $_BIN"
# echo "_RUN: $_RUN"

if [ -d $_DENO ]; then  
    # dev only, to remove in production
    if [ -L $_BIN ]; 
        then rm $_BIN; fi

    if ! [ -L $_BIN ]; 
        then ln -s $_SELF $_BIN; fi
fi

exec $_RUN "$@"