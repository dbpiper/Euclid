import ApolloClient from 'apollo-boost';
import 'normalize.css';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';

import textColor from 'App/shared/styles/text-color';
import Home from './screens/Home';

const serverUrl = `${process.env.SERVER_PROTOCOL}://${
  process.env.SERVER_ADDRESS
}:${process.env.SERVER_PORT}`;

if (serverUrl.includes('undefined')) {
  // tslint:disable-next-line: no-console
  console.warn('server url is not loaded properly!!');
}

const client = new ApolloClient({
  uri: serverUrl,
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
