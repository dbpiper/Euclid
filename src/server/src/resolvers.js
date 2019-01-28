
export default {
  Query: {
    stock(root, args, context) {
      return context.prisma.stock({ id: args.stockId });
    },
    stocks(root, args, context) {
      return context.prisma.stocks({ where: { ticker: args.ticker } });
    },
  },
  Mutation: {
    createStock(root, args, context) {
      return context.prisma.createStock(
        { date: args.date, price: args.price, ticker: args.ticker },
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
