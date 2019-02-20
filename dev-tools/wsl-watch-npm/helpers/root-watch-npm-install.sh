#!/bin/bash

get_abs_filename() {
  # $1 : relative filename
  echo "$(cd "${1}"; pwd -P)"
}

resolve_path() {
  # $1 : path to this script
  # $2 : relative path to navigate from this script to
  cd "${1}"
  echo "$(get_abs_filename "${2}")"
}

scriptPath="$( cd "$(dirname "${0}")" ; pwd -P )"

echo $scriptPath

watchPath=$(resolve_path "$scriptPath" "../../../")


# start watching Euclid root path
watchman watch $watchPath

# watch package.json for changes and install packages on change
watchman \
  -- trigger $watchPath install-packages 'package.json' \
    -- cd $watchPath && npm install
