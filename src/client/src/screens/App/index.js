import React from 'react';

import styled from 'styled-components';

import Home from './screens/Home';

const AppStyles = styled.section`
  background-color: #262a30;
  color: #ffffff;

  width: 100%;
  height: 100%;

  position: fixed;
`;

const App = function App() {
  return (
    <AppStyles>
      <Home />
    </AppStyles>
  );
};

export default App;
