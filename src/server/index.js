import { GraphQLServer } from 'graphql-yoga';
import * as R from 'ramda';

import { prisma } from './generated/prisma-client';

import fetchStock from './src/fetchStock';
import formatStockData from './src/formatStockData';

const resolvers = {
  Query: {
    publishedPosts(root, args, context) {
      return context.prisma.posts({ where: { published: true } });
    },
    post(root, args, context) {
      return context.prisma.post({ id: args.postId });
    },
    postsByUser(root, args, context) {
      return context.prisma.user({
        id: args.userId,
      }).posts();
    },
  },
  Mutation: {
    createDraft(root, args, context) {
      return context.prisma.createPost(
        {
          title: args.title,
          author: {
            connect: { id: args.userId },
          },
        },
      );
    },
    publish(root, args, context) {
      return context.prisma.updatePost(
        {
          where: { id: args.postId },
          data: { published: true },
        },
      );
    },
    createUser(root, args, context) {
      return context.prisma.createUser(
        { name: args.name },
      );
    },
  },
  User: {
    posts(root, args, context) {
      return context.prisma.user({
        id: root.id,
      }).posts();
    },
  },
  Post: {
    author(root, args, context) {
      return context.prisma.post({
        id: root.id,
      }).author();
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
});


server.start(() => console.log('Server is running on http://localhost:4000'));

(async () => {
  const data = await fetchStock('AAPL');
  const formattedData = formatStockData(data);
  console.log({
    ticker: formattedData.ticker,
    data: R.take(5, formattedData.data),
  });
})();
