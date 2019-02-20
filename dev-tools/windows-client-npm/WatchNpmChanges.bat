@echo off

rem theoretically this should work, however I am getting
rem some odd npm install errors where it is failing on
rem unlinking, so I am not using these.

start .\helpers\root-watch-npm-install.bat
start .\helpers\client-watch-npm-install.bat
start .\helpers\server-watch-npm-install.bat

@echo on
