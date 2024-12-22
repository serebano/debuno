# local dev link for debuno
# if ! [ -L ./node_modules/debuno ]; then ln -s $HOME/dev/debuno ./node_modules/debuno; fi

# global dev link for debuno
BIN_PATH=$HOME/.deno/bin/debuno
rm $BIN_PATH
if ! [ -L $BIN_PATH ]; then ln -s $HOME/dev/debuno/cli.ts $BIN_PATH; fi
