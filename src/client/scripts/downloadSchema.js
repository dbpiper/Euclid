/* eslint-disable import/first */
process.env.BABEL_ENV = 'node';

import {
  exec,
} from 'promisify-child-process';
import ServerInfo from '../config/ServerInfo-secret';


const main = async () => {
  try {
    const {
      stdout,
      stderr,
    } = await exec(`npx apollo schema:download \
      --endpoint=${ServerInfo.Node.uri} graphql-schema.json`, {
      encoding: 'utf-8',
    });

    // eslint-disable-next-line no-console
    console.log(stdout);
    // eslint-disable-next-line no-console
    console.error(stderr);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

main();
