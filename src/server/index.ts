import cors from 'cors';
import { GraphQLServer, Options } from 'graphql-yoga';
import HttpStatus from 'http-status-codes';

import { prisma } from './generated/prisma-client';

import ServerInfo from './config/ServerInfo-secret';
import pullAndSaveData from './src/pullAndSaveData';
import resolvers from './src/resolvers';

const firstArg = 2;
const notFound = -1;
const args = process.argv.slice(firstArg);
const buildOnly = args.indexOf('--build') !== notFound;
const production: boolean = args.indexOf('--production') !== notFound;
const downloadDataArg = args.indexOf('--download-data') !== notFound;

const featureFlags = Object.freeze({
  __proto__: null,
  downloadData: downloadDataArg,
});

const playgroundUrl: string | false = production ? '/' : false;

const server = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql',
  context: prisma,
});

server.express.use(cors());

// send HTTP 200 -- OK so that npm scripts know the server is running
server.express.head('/', (_req, res) => {
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

  const httpServer = await server.start(options, () => {
    // tslint:disable-next-line no-console
    console.log(`Server is running on ${ServerInfo.Node.uri}`);

    if (buildOnly) {
      const noErrors = 0;
      process.exit(noErrors);
    }
  });

  if (featureFlags.downloadData) {
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
