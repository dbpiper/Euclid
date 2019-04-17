import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import styled from 'styled-components';

import textColor from 'App/shared/styles/text-color';
import SelectTickerSearchField from '../containers/SelectTickerSearchField';

const Head = styled.section`
  text-align: center;
  background: #000000;
  padding-bottom: 1rem;
  ${textColor}
`;

const Title = styled.span`
  text-align: center;
  margin: 3rem;

  font-size: 3rem;
`;

const SearchArea = styled.div`
  padding-left: 30rem;
`;

const Header = () => (
  <Head>
    <Title>Euclid</Title>

    <SearchArea>
      <ErrorBoundary>
        {
          // disabling because the react-redux types are broken
          // tslint:disable-next-line no-unsafe-any
          <SelectTickerSearchField />
        }
      </ErrorBoundary>
    </SearchArea>
  </Head>
);

export default Header;
