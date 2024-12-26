if ! [ -L ./node_modules/debuno ]; then 
    echo "  Link already removed"
fi

if [ -L ./node_modules/debuno ]; then 
    rm ./node_modules/debuno;
    echo "  Link removed";
fi


