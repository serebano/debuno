#!/bin/sh

$(dirname $(realpath $0))/check.sh;
$(dirname $(realpath $0))/info.sh;

echo
echo "  Run: "
echo "  debuno [deno|bun|node] [...args]"
echo
echo "  Commands: "
echo "  debuno [init|info|link|unlink|dev|upgrade|reinstall|uninstall]"
echo