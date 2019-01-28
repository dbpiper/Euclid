import { GraphQLServer } from 'graphql-yoga';
import * as R from 'ramda';

import { prisma } from './generated/prisma-client';

import resolvers from './src/resolvers';
import pullAndSaveData from './src/pullAndSaveData';

import ServerInfo from './config/ServerInfo-secret';

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
});


server.start(() => console.log(`Server is running on ${ServerInfo.Node.uri}`));

(async () => {
  try {
    await pullAndSaveData('AAPL');
    await pullAndSaveData('SPY');
    await pullAndSaveData('AMZN');
    await pullAndSaveData('GOOG');
    await pullAndSaveData('YELP');

    // await pullAndSaveData('VFIAX'); IEX gives null dates
    // await pullAndSaveData('LNKD'); IEX give null dates

    await pullAndSaveData('MSFT');


    console.log('done adding data');
  } catch (err) {
    console.log(err);
  }
  // const stockList = await prisma
  //   .stockList({ ticker: 'AAPL' });
  // console.log(stockList);
})();
