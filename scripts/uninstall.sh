#!/bin/sh

function uninstall() {
    if [ "$(which deno)" != "" ]; then deno clean; fi
    rm -rf $HOME/.deno
    rm -rf $HOME/.bun
    rm -rf $HOME/.nvm
    rm -rf $HOME/.npm
    rm -rf $HOME/.debuno
}

uninstall