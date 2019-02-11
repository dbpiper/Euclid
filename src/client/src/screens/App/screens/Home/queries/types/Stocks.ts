/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Stocks
// ====================================================

export interface Stocks_stocks {
  __typename: "Stock";
  price: number;
  date: number;
  ticker: string;
}

export interface Stocks {
  stocks: Stocks_stocks[];
}

export interface StocksVariables {
  ticker: string;
  earliestDate: number;
}
