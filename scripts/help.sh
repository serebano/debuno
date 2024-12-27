#!/bin/sh

function check() { $(dirname $(realpath $0))/check.sh; }

check

echo
echo "  Run: "
echo "  debuno [deno|bun|node] [...args]"
echo
echo "  Commands: "
echo "  debuno [init|info|link|unlink|reinstall]"
echo