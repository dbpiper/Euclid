import _ from 'lodash';

export default {
  Query: {
    stocks(_root: any, args: any, context: any) {
      return context.prisma.stocks({
        where: {
          date_gt: args.earliestDate,
          ticker: args.ticker,
        },
      });
    },
    allStocks(_root: any, _args: any, context: any) {
      return context.prisma.stocks();
    },
    async tickers(_root: any, _args: any, context: any) {
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
