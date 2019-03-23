import cors from 'cors';
import { GraphQLServer, Options } from 'graphql-yoga';
import HttpStatus from 'http-status-codes';

import { prisma } from './generated/prisma-client';

import pullAndSaveData from './src/pullAndSaveData';
import resolvers from './src/resolvers';

const _firstArg = 2;
const _notFound = -1;
const _args = process.argv.slice(_firstArg);
const _buildOnly = _args.indexOf('--build') !== _notFound;
const _production: boolean = _args.indexOf('--production') !== _notFound;
const _downloadDataArg = _args.indexOf('--download-data') !== _notFound;
const _serverUrl = `${process.env.SERVER_PROTOCOL}://${
  process.env.SERVER_ADDRESS
}:${process.env.SERVER_PORT}`;

const _featureFlags = Object.freeze({
  __proto__: null,
  downloadData: _downloadDataArg,
});

let playgroundUrl: string | false;

if (_production) {
  playgroundUrl = false;
} else {
  playgroundUrl = '/';
}

const _server = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql',
  context: prisma,
});

_server.express.use(cors());

// send HTTP 200 -- OK so that npm scripts know the server is running
_server.express.head('/', (_req, res) => {
  res.sendStatus(HttpStatus.OK);
});

// prettier-ignore-next
const tryAddData = async (ticker: string) => {
  try {
    await pullAndSaveData(ticker);
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.error(err);
  }
};

(async () => {
  const options: Options = {
    playground: playgroundUrl,
  };

  const httpServer = await _server.start(options, () => {
    // tslint:disable-next-line no-console
    console.log(`Server is running on ${_serverUrl}`);

    if (_buildOnly) {
      const noErrors = 0;
      process.exit(noErrors);
    }
  });

  if (_featureFlags.downloadData) {
    await tryAddData('AAPL');
    await tryAddData('SPY');
    await tryAddData('AMZN');
    await tryAddData('GOOG');
    await tryAddData('YELP');
    await tryAddData('MSFT');

    // tslint:disable-next-line no-console
    console.log('done adding data');

    httpServer.close();
  }
})();
