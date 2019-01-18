import { GraphQLServer } from 'graphql-yoga';
import * as R from 'ramda';

import { prisma } from './generated/prisma-client';

import resolvers from './src/resolvers';
// import fetchStock from './src/fetchStock';
// import formatStockData from './src/formatStockData';


const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
});


server.start(() => console.log('Server is running on http://localhost:4000'));

(async () => {
  // const data = await fetchStock('AAPL');
  // const formattedData = formatStockData(data);
  // await prisma
  //   .createStockList({
  //     ticker: formattedData.ticker,
  //     stocks: {
  //       create: formattedData.data,
  //     },
  //   });
  const stockList = await prisma
    .stockList({ ticker: 'AAPL' });
  console.log(stockList);
})();
