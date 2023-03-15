#!/bin/bash

docker ps | grep app1
[ $? -eq 0 ] || exit 1

exit 0
