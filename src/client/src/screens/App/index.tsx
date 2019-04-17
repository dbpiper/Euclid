import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import 'normalize.css';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';

import textColor from 'App/shared/styles/text-color';
import Home from './screens/Home';

const serverUrl = `${process.env.SERVER_PROTOCOL}://${
  process.env.SERVER_ADDRESS
}:${process.env.SERVER_PORT}`;

// if the url is broken, we want to know about it...
if (serverUrl.includes('undefined')) {
  // but, not in production!!
  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line: no-console
    console.warn('server url is not loaded properly!!');
  }
}

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new BatchHttpLink({
      uri: serverUrl,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
});

const AppStyles = styled.section`
  background-color: #262a30;
  ${textColor};

  width: 100%;
  height: 100%;

  position: fixed;

  overflow-x: auto;
  overflow-y: hidden;
`;

const App = () => (
  <ApolloProvider client={client}>
    <AppStyles>
      <Home />
    </AppStyles>
  </ApolloProvider>
);

export default App;
