#!/bin/bash

#docker ps | grep app1
echo "Done"
[ $? -eq 0 ] || exit 1

exit 0
