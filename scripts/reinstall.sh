#!/bin/sh

_BASE=$(dirname $(dirname $(realpath $0)))

cat "$_BASE/install" | sh -s -- -r