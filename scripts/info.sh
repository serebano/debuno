#!/bin/sh

# Deno
if [ "$(which deno)" != "" ]; 
then
    v=$(deno -v)
    echo "  ${v//deno/Deno:} $(which deno)"
else
    echo "  Deno: not installed"
fi

# Bun
if [ "$(which bun)" != "" ]; 
then
    echo "  Bun: $(bun -v) $(which bun)"
else
    echo "  Bun: not installed"
fi

# Node
if [ "$(which node)" != "" ]; 
then
    echo "  Node: $(node -v) $(which node)"
else
    echo "  Node: not installed"
fi

# Debuno
if [ "$(which debuno)" != "" ]; 
then
    echo "  Debuno: $(debuno -v) $(realpath $(which debuno))"
else
    echo "  Debuno: not installed"
fi

