import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';

import pullAndSaveData from './src/pullAndSaveData';
import resolvers from './src/resolvers';

import ServerInfo from './config/ServerInfo-secret';


const firstArg = 2;
const notFound = -1;
const args = process.argv.slice(firstArg);
const buildOnly = args.indexOf('--build') !== notFound;
const downloadDataArg = args.indexOf('--download-data') !== notFound;

const featureFlags = Object.freeze({
  __proto__: null,
  downloadData: downloadDataArg,
});

const server = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql',
  context: {
    prisma,
  },
});

server.start(() => {
  // tslint:disable-next-line no-console
  console.log(`Server is running on ${ServerInfo.Node.uri}`);

  if (buildOnly) {
    const noErrors = 0;
    process.exit(noErrors);
  }
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
  if (featureFlags.downloadData) {
    await tryAddData('AAPL');
    await tryAddData('SPY');
    await tryAddData('AMZN');
    await tryAddData('GOOG');
    await tryAddData('YELP');
    await tryAddData('MSFT');
  }

  // tslint:disable-next-line no-console
  console.log('done adding data');
})();
