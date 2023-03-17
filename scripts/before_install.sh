#!/bin/bash
set -e

docker image prune --filter "until=48h" -f

exit 0
