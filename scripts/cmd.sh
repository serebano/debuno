_BASE=$(dirname $(realpath $0))
_PATH="$_BASE/help.sh"
_ARGS=()
 
for _ARG in "$@"
do
    case $_ARG in
        -v|--version)
            _PATH="$_BASE/version.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        init)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        info)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        link)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        unlink)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        reinstall)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        uninstall)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;        
        upgrade)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        dev)
            _PATH="$_BASE/$_ARG.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        *)
            echo "Usage: debuno [init|info|link|unlink|dev|upgrade|reinstall|uninstall]"
            exit 1
        ;;
    esac
done

exec $_PATH ${_ARGS[*]}

