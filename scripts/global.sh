#!/bin/sh

_SELF=$(realpath $0)
_BASE=$(dirname $_SELF)
_BIN=$HOME/.deno/bin/debuno

echo "_SELF: $_SELF"
echo "_BASE: $_BASE"
echo "_BIN: $_BIN"

# dev only, to remove in production
if [ -L $_BIN ]; 
    then rm $_BIN; fi

if ! [ -L $_BIN ]; 
    then ln -s $_SELF $_BIN; fi