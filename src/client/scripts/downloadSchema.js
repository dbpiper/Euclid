/* eslint-disable import/first */
process.env.BABEL_ENV = 'node';

import terminalSpawn from 'terminal-spawn';

const serverUrl = `${process.env.SERVER_PROTOCOL}://${
  process.env.SERVER_ADDRESS
}:${process.env.SERVER_PORT}`;

(async () => {
  await terminalSpawn(
    `npx apollo schema:download \
      --endpoint=${serverUrl} graphql-schema.json`
  ).promise;
})();
