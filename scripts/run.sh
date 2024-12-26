_BASE=$(dirname $(realpath $0))
_PATH="$_BASE/cmd.sh"
_ARGS=()
 
for arg in "$@"
do
    case $arg in
        deno)
            _PATH="$_BASE/deno.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        bun)
            _PATH="$_BASE/bun.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        node)
            _PATH="$_BASE/node.sh"
            shift
            _ARGS+=("$@")
            break
        ;;
        *)
            _PATH="$_BASE/cmd.sh"
            _ARGS+=("$@")
            break
        ;;
    esac
done

# echo "RUN _PATH: $_PATH"

exec $_PATH ${_ARGS[*]}

