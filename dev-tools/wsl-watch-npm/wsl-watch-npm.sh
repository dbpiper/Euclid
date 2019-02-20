#!/bin/sh

sh ./helpers/root-watch-npm-install.sh & pidRoot=$!
sh ./helpers/client-watch-npm-install.sh & pidClient=$!
sh ./helpers/server-watch-npm-install.sh & pidServer=$!

wait $pidRoot
wait $pidClient
wait $pidServer
