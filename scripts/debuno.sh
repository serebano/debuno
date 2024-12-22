echo "---------------------------------"
if [ "$(which debuno)" != "" ]; 
then
    echo "  DeBuNo: $(debuno -v) $(which debuno)"
else
    echo "  DeBuNo: not installed"
fi
echo "---------------------------------"
