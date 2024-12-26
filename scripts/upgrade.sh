#!/bin/sh

_LATEST_VERSION=$(curl -s https://debuno.dev/version)
_CURRENT_VERSION=$(debuno -v)


echo "  Latest version: $_LATEST_VERSION"
echo "  Current version: $_CURRENT_VERSION"