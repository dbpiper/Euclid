import ApolloClient from 'apollo-boost';
import 'normalize.css';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';

import textColor from 'App/shared/styles/text-color';
import ServerInfo from 'config/ServerInfo-secret';
import Home from './screens/Home';

const client = new ApolloClient({
  uri: ServerInfo.Node.uri,
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
