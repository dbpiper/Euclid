#!/bin/sh

dir="$(dirname ${0})"
rootPath="${dir}/.."
# get the absolute path to the script so it works with dot space calling
loadDotenvPath=$(readlink -e "${dir}/helper-scripts/load-dotenv.sh")

# use "dot space script" calling syntax to exectue the script using
# the current shell, which lets us use the .env vars
. /${loadDotenvPath}

# array simulation in sh based on: https://unix.stackexchange.com/a/323535

# template files containing the env vars that get replaced
prismaTemplate="${rootPath}/src/server/config/templates/prisma.yml"
dockerComposeTemplate="${rootPath}/src/server/config/templates/docker-compose.yml"
dockerfileTemplate="${rootPath}/src/server/config/templates/Dockerfile"
cypressDotenvsTemplate="${rootPath}/src/client/cypress/config/templates/dotenvs.ts"

# put them into a fake "array"
envTemplateFiles="${envTemplateFiles} ${prismaTemplate}"
envTemplateFiles="${envTemplateFiles} ${dockerComposeTemplate}"
envTemplateFiles="${envTemplateFiles} ${dockerfileTemplate}"
envTemplateFiles="${envTemplateFiles} ${cypressDotenvsTemplate}"

# output files which are actually used by Euclid
prisma="${rootPath}/src/server/prisma.yml"
dockerCompose="${rootPath}/src/server/docker-compose.yml"
dockerfile="${rootPath}/src/server/config/docker/prisma/Dockerfile"
cypressDotenvs="${rootPath}/src/client/cypress/config/dotenvs.ts"

# put them into a fake "array"
envOutputFiles="${envOutputFiles} ${prisma}"
envOutputFiles="${envOutputFiles} ${dockerCompose}"
envOutputFiles="${envOutputFiles} ${dockerfile}"
envOutputFiles="${envOutputFiles} ${cypressDotenvs}"

mkdir -p "${rootPath}/src/server/config/docker/prisma"

# cut's -f${index} syntax is 1-indexed instead of 0
i=1
for envTemplateFile in ${envTemplateFiles}; do
  indexCommand="-f${i}"

  # read the output file with cut hack
  outputFile=$(echo ${envOutputFiles} | cut -d' ' ${indexCommand})

  cat ${envTemplateFile} | envsubst | tee ${outputFile} > /dev/null
  i=$((i + 1))
done
