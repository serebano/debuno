#!/bin/sh
_BIN=$HOME/.debuno/bin/debuno
_DENO_BIN=$HOME/.deno/bin/debuno

git clone https://github.com/serebano/debuno.git $HOME/.debuno


if [ -L $_DENO_BIN ]; 
    then rm $_DENO_BIN; fi

if ! [ -L $_DENO_BIN ]; 
    then ln -s $_BIN $_DENO_BIN; fi

exec debuno check