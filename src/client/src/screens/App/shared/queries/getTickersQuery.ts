import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

const getTickersQuery = gql`
  query Tickers {
    tickers
  }
` as DocumentNode;

export default getTickersQuery;
