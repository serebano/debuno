#!/bin/sh

# Debuno
if [ "$(which debuno)" != "" ]; 
then
    echo
    echo "  debuno   $(debuno -v)  $(realpath $(which debuno))"
    echo
else
    echo
    echo "  debuno   not installed"
    echo
fi

# Deno
if [ "$(which deno)" != "" ]; 
then
    v=$(deno -v)
    echo "  ${v//deno/deno    }  $(which deno)"
else
    echo "  deno    not installed"
fi

# Bun
if [ "$(which bun)" != "" ]; 
then
    echo "  bun      $(bun -v)  $(which bun)"
else
    echo "  bun      not installed"
fi

# Node
if [ "$(which node)" != "" ]; 
then
    echo "  node     $(node -v)  $(which node)"
else
    echo "  node     not installed"
fi


