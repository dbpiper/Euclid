#!/bin/sh

# Based on: https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836

dir="$(dirname ${0})"
envPath="${dir}/../.env"

export $(egrep -v '^#' ${envPath} | xargs -d '\n')
