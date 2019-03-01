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

scriptPath="$(dirname "$(readlink -f "$0")")"

watchPath=$(resolve_path "$scriptPath" "../../")
logPath=$watchPath/logs/watchman.log
mkdir -p "$watchPath/logs/"

# start watching Euclid root path
watchman -o "$logPath" watch $watchPath

# watch package.json for changes and install packages on change
watchman -j <<-EOT
["trigger", "$watchPath", {
  "name": "packages",
  "expression": ["pcre", "package.json"],
  "command": ["cd $watchPath", "npm install"]
}]
EOT
