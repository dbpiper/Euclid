/* eslint-disable import/first */
process.env.BABEL_ENV = 'node';

import {
  spawn,
} from 'child_process';
import ServerInfo from '../config/ServerInfo-secret';

const main = async () => {
  try {
    const apolloGenerate = spawn('npx', ['apollo', 'schema:download',
      `--endpoint=${ServerInfo.Node.uri}`, 'graphql-schema.json',
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
