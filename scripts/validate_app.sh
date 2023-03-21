#!/bin/bash

docker ps | grep zk-groups
[ $? -eq 0 ] || exit 1

exit 0
