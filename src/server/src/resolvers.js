
export default {
  Query: {
    stock(root, args, context) {
      return context.prisma.stock({ id: args.stockId });
    },
    stockList(root, args, context) {
      return context.prisma.stockList({ ticker: args.stockListTicker }).stocks;
    },
  },
  Mutation: {
    createStock(root, args, context) {
      return context.prisma.createStock(
        { price: args.price, date: args.date },
      );
    },
    createStockList(root, args, context) {
      return context.prisma.createStockList(
        { ticker: args.ticker, stocks: args.stocks },
      );
    },
  },
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
