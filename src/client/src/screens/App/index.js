import React from 'react';

import styled from 'styled-components';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Home from './screens/Home';

const server = '192.168.1.6';

const client = new ApolloClient({
  uri: `http://${server}:4466`,
});

const AppStyles = styled.section`
  background-color: #262a30;
  color: #ffffff;

  width: 100%;
  height: 100%;

  position: fixed;
`;

const App = function App() {
  return (
    <ApolloProvider client={client}>
      <AppStyles>
        <Home />
      </AppStyles>
    </ApolloProvider>
  );
};

export default App;
