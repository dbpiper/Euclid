import React from 'react';

import styled from 'styled-components';

import SearchField from './SearchField';

const Head = styled.section`
  text-align: center;
  background: #000000;
  padding-bottom: 1rem;
`;

const Title = styled.span`
  text-align: center;
  margin: 3rem;

  font-size: 3rem;
`;

const SearchArea = styled.div`
  padding-left: 30rem;
`;

const Header = function Header() {
  return (
    <Head>
      <Title>
        Euclid
      </Title>

      <SearchArea>
        <SearchField />
      </SearchArea>
    </Head>
  );
};

export default Header;
