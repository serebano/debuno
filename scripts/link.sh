# local dev link for debuno
if [ ! -d ./node_modules ]; then mkdir ./node_modules; fi
if [ -L ./node_modules/debuno ]; then rm ./node_modules/debuno; fi

if ! [ -L ./node_modules/debuno ]; then 
    ln -s $HOME/dev/debuno ./node_modules/debuno; 
    echo "  Link created"
    echo "  Source: $HOME/dev/debuno"
    echo "  Destination: $PWD/node_modules/debuno"
fi
