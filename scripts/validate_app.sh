#!/bin/bash

docker ps | grep bandada
[ $? -eq 0 ] || exit 1

exit 0
