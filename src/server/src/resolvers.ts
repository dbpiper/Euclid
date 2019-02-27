import _ from 'lodash';

export default {
  Query: {
    stocks(_root: any, args: any, context: any) {
      return context.stocks({
        where: {
          date_gt: args.earliestDate,
          ticker: args.ticker,
        },
      });
    },
    allStocks(_root: any, _args: any, context: any) {
      return context.stocks();
    },
    async tickers(_root: any, _args: any, context: any) {
      const stocks = await context.stocks();
      const tickers = _.map(stocks, elem => elem.ticker);
      const uniqueTickers = _.uniq(tickers);
      return uniqueTickers;
    },
  },
};
