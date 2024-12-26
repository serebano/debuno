#!/bin/sh

_BASE=$(dirname $(realpath $0))

_CHECK=$_BASE/check.sh
_INSTALL=$_BASE/install.sh
_UNINSTALL=$_BASE/uninstall.sh

$_UNINSTALL
$_INSTALL
$_CHECK
