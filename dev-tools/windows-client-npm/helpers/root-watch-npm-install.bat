@echo off

rem Make path realtive
set "relativePath=%~dp0\..\..\..\"
for %%i in ("%relativePath%") do SET "absolutePath=%%~fi"

rem start watching Euclid root path
watchman.exe watch %absolutePath%

rem watch package.json for changes and install packages on change
watchman.exe ^
  -- trigger %absolutePath% install-packages 'package.json' ^
    -- cd ../../../ && npm install --no-bin-links

@echo on
