import _ from 'lodash';

export default {
  Query: {
    stocks(root, args, context) {
      return context.prisma.stocks({
        where: {
          date_gt: args.earliestDate,
          ticker: args.ticker,
        },
      });
    },
    allStocks(root, args, context) {
      return context.prisma.stocks();
    },
    async tickers(root, args, context) {
      const stocks = await context.prisma.stocks();
      const tickers = _.map(stocks, elem => elem.ticker);
      const uniqueTickers = _.uniq(tickers);
      return uniqueTickers;
    },
  },
  // Mutation: {
  //   createStock(root, args, context) {
  //     return context.prisma.createStock(
  //       { date: args.date, price: args.price, ticker: args.ticker },
  //     );
  //   },
  // },
  // User: {
  //   // posts(root, args, context) {
  //   //   return context.prisma.user({
  //   //     id: root.id,
  //   //   }).posts();
  //   // },
  // },
  // Post: {
  //   // author(root, args, context) {
  //   //   return context.prisma.post({
  //   //     id: root.id,
  //   //   }).author();
  //   // },
  // },
};
