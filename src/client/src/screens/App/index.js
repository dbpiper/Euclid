import React from 'react';

import styled from 'styled-components';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';

// import Home from './screens/Home';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
});

const AppStyles = styled.section`
  background-color: #262a30;
  color: #ffffff;

  width: 100%;
  height: 100%;

  position: fixed;
`;

const ExchangeRates = () => (
  <Query
    query={gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }  
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>
            {currency}
            :
            {' '}
            {rate}
          </p>
        </div>
      ));
    }}
  </Query>
);

const App = function App() {
  return (
    <ApolloProvider client={client}>
      <AppStyles>
        {/* <Home /> */}
        <ExchangeRates />
      </AppStyles>
    </ApolloProvider>
  );
};

export default App;
