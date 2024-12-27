# local dev link for debuno
_BASE=$(dirname $(dirname $(realpath $0)))

if [ ! -d ./node_modules ]; then mkdir ./node_modules; fi
if [ -L ./node_modules/debuno ]; then rm ./node_modules/debuno; fi

if ! [ -L ./node_modules/debuno ]; then 
    ln -s $_BASE ./node_modules/debuno; 
    echo "  Link created"
    echo "  Source: $_BASE"
    echo "  Destination: $PWD/node_modules/debuno"
fi
