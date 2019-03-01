/* eslint-disable import/first */
process.env.BABEL_ENV = 'node';

import {
  spawn,
} from 'child_process';


const main = async () => {
  try {
    const apolloGenerate = spawn('npx', ['apollo', 'codegen:generate',
      '--localSchemaFile=graphql-schema.json', '--target=typescript',
      '--includes=src/**/*.ts', '--tagName=gql', '--addTypename',
      '--globalTypesFile=src/config/types/graphql-global-types.ts',
      'types',
    ]);

    apolloGenerate.stdout.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(data.toString());
    });

    apolloGenerate.stderr.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.error(data.toString());
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

main();
