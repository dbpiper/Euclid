import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';

import resolvers from './src/resolvers';
// import pullAndSaveData from './src/pullAndSaveData';

import ServerInfo from './config/ServerInfo-secret';

const firstArg = 2;
const notFound = -1;
const args = process.argv.slice(firstArg);
const buildOnly = args.indexOf('--build') !== notFound;

const server = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql',
  context: {
    prisma,
  },
});


// tslint:disable-next-line no-console
server.start(() => {
  console.log(`Server is running on ${ServerInfo.Node.uri}`);

  if (buildOnly) {
    const noErrors = 0;
    process.exit(noErrors);
  }
});

// const tryAddData = async (ticker) => {
//   try {
//     await pullAndSaveData(ticker);
//   } catch (err) {
//     console.error(err);
//   }
// };

(async () => {
  // await tryAddData('AAPL');
  // await tryAddData('SPY');
  // await tryAddData('AMZN');
  // await tryAddData('GOOG');
  // await tryAddData('YELP');
  // await tryAddData('MSFT');

  // await pullAndSaveData('VFIAX'); IEX gives null dates
  // await pullAndSaveData('LNKD'); IEX give null dates

  // tslint:disable-next-line no-console
  console.log('done adding data');
  // const stockList = await prisma
  //   .stockList({ ticker: 'AAPL' });
  // console.log(stockList);
})();
