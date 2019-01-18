module.exports = {
        typeDefs: /* GraphQL */ `type AggregateStock {
  count: Int!
}

type AggregateStockList {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar Long

type Mutation {
  createStock(data: StockCreateInput!): Stock!
  updateStock(data: StockUpdateInput!, where: StockWhereUniqueInput!): Stock
  updateManyStocks(data: StockUpdateManyMutationInput!, where: StockWhereInput): BatchPayload!
  upsertStock(where: StockWhereUniqueInput!, create: StockCreateInput!, update: StockUpdateInput!): Stock!
  deleteStock(where: StockWhereUniqueInput!): Stock
  deleteManyStocks(where: StockWhereInput): BatchPayload!
  createStockList(data: StockListCreateInput!): StockList!
  updateStockList(data: StockListUpdateInput!, where: StockListWhereUniqueInput!): StockList
  updateManyStockLists(data: StockListUpdateManyMutationInput!, where: StockListWhereInput): BatchPayload!
  upsertStockList(where: StockListWhereUniqueInput!, create: StockListCreateInput!, update: StockListUpdateInput!): StockList!
  deleteStockList(where: StockListWhereUniqueInput!): StockList
  deleteManyStockLists(where: StockListWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  stock(where: StockWhereUniqueInput!): Stock
  stocks(where: StockWhereInput, orderBy: StockOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Stock]!
  stocksConnection(where: StockWhereInput, orderBy: StockOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): StockConnection!
  stockList(where: StockListWhereUniqueInput!): StockList
  stockLists(where: StockListWhereInput, orderBy: StockListOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [StockList]!
  stockListsConnection(where: StockListWhereInput, orderBy: StockListOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): StockListConnection!
  node(id: ID!): Node
}

type Stock {
  id: ID!
  price: Float!
  date: Int!
}

type StockConnection {
  pageInfo: PageInfo!
  edges: [StockEdge]!
  aggregate: AggregateStock!
}

input StockCreateInput {
  price: Float!
  date: Int!
}

input StockCreateManyInput {
  create: [StockCreateInput!]
  connect: [StockWhereUniqueInput!]
}

type StockEdge {
  node: Stock!
  cursor: String!
}

type StockList {
  ticker: String!
  stocks(where: StockWhereInput, orderBy: StockOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Stock!]
}

type StockListConnection {
  pageInfo: PageInfo!
  edges: [StockListEdge]!
  aggregate: AggregateStockList!
}

input StockListCreateInput {
  ticker: String!
  stocks: StockCreateManyInput
}

type StockListEdge {
  node: StockList!
  cursor: String!
}

enum StockListOrderByInput {
  ticker_ASC
  ticker_DESC
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type StockListPreviousValues {
  ticker: String!
}

type StockListSubscriptionPayload {
  mutation: MutationType!
  node: StockList
  updatedFields: [String!]
  previousValues: StockListPreviousValues
}

input StockListSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: StockListWhereInput
  AND: [StockListSubscriptionWhereInput!]
  OR: [StockListSubscriptionWhereInput!]
  NOT: [StockListSubscriptionWhereInput!]
}

input StockListUpdateInput {
  ticker: String
  stocks: StockUpdateManyInput
}

input StockListUpdateManyMutationInput {
  ticker: String
}

input StockListWhereInput {
  ticker: String
  ticker_not: String
  ticker_in: [String!]
  ticker_not_in: [String!]
  ticker_lt: String
  ticker_lte: String
  ticker_gt: String
  ticker_gte: String
  ticker_contains: String
  ticker_not_contains: String
  ticker_starts_with: String
  ticker_not_starts_with: String
  ticker_ends_with: String
  ticker_not_ends_with: String
  stocks_every: StockWhereInput
  stocks_some: StockWhereInput
  stocks_none: StockWhereInput
  AND: [StockListWhereInput!]
  OR: [StockListWhereInput!]
  NOT: [StockListWhereInput!]
}

input StockListWhereUniqueInput {
  ticker: String
}

enum StockOrderByInput {
  id_ASC
  id_DESC
  price_ASC
  price_DESC
  date_ASC
  date_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type StockPreviousValues {
  id: ID!
  price: Float!
  date: Int!
}

input StockScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  price: Float
  price_not: Float
  price_in: [Float!]
  price_not_in: [Float!]
  price_lt: Float
  price_lte: Float
  price_gt: Float
  price_gte: Float
  date: Int
  date_not: Int
  date_in: [Int!]
  date_not_in: [Int!]
  date_lt: Int
  date_lte: Int
  date_gt: Int
  date_gte: Int
  AND: [StockScalarWhereInput!]
  OR: [StockScalarWhereInput!]
  NOT: [StockScalarWhereInput!]
}

type StockSubscriptionPayload {
  mutation: MutationType!
  node: Stock
  updatedFields: [String!]
  previousValues: StockPreviousValues
}

input StockSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: StockWhereInput
  AND: [StockSubscriptionWhereInput!]
  OR: [StockSubscriptionWhereInput!]
  NOT: [StockSubscriptionWhereInput!]
}

input StockUpdateDataInput {
  price: Float
  date: Int
}

input StockUpdateInput {
  price: Float
  date: Int
}

input StockUpdateManyDataInput {
  price: Float
  date: Int
}

input StockUpdateManyInput {
  create: [StockCreateInput!]
  update: [StockUpdateWithWhereUniqueNestedInput!]
  upsert: [StockUpsertWithWhereUniqueNestedInput!]
  delete: [StockWhereUniqueInput!]
  connect: [StockWhereUniqueInput!]
  disconnect: [StockWhereUniqueInput!]
  deleteMany: [StockScalarWhereInput!]
  updateMany: [StockUpdateManyWithWhereNestedInput!]
}

input StockUpdateManyMutationInput {
  price: Float
  date: Int
}

input StockUpdateManyWithWhereNestedInput {
  where: StockScalarWhereInput!
  data: StockUpdateManyDataInput!
}

input StockUpdateWithWhereUniqueNestedInput {
  where: StockWhereUniqueInput!
  data: StockUpdateDataInput!
}

input StockUpsertWithWhereUniqueNestedInput {
  where: StockWhereUniqueInput!
  update: StockUpdateDataInput!
  create: StockCreateInput!
}

input StockWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  price: Float
  price_not: Float
  price_in: [Float!]
  price_not_in: [Float!]
  price_lt: Float
  price_lte: Float
  price_gt: Float
  price_gte: Float
  date: Int
  date_not: Int
  date_in: [Int!]
  date_not_in: [Int!]
  date_lt: Int
  date_lte: Int
  date_gt: Int
  date_gte: Int
  AND: [StockWhereInput!]
  OR: [StockWhereInput!]
  NOT: [StockWhereInput!]
}

input StockWhereUniqueInput {
  id: ID
}

type Subscription {
  stock(where: StockSubscriptionWhereInput): StockSubscriptionPayload
  stockList(where: StockListSubscriptionWhereInput): StockListSubscriptionPayload
}
`
      }
    