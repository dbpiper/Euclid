import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';

import resolvers from './src/resolvers';
// import pullAndSaveData from './src/pullAndSaveData';

import ServerInfo from './config/ServerInfo-secret';

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
});


server.start(() => console.log(`Server is running on ${ServerInfo.Node.uri}`));

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


  console.log('done adding data');
  // const stockList = await prisma
  //   .stockList({ ticker: 'AAPL' });
  // console.log(stockList);
})();
