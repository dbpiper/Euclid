import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

const getStocksQuery = gql`
  query Stocks($ticker: String!, $earliestDate: Int!) {
    stocks(ticker: $ticker, earliestDate: $earliestDate) {
      price
      date
      ticker
    }
  }
` as DocumentNode;

export default getStocksQuery;
