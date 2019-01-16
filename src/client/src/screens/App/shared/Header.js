import React from 'react';

import styled from 'styled-components';

const Head = styled.section`
  text-align: center;
  padding: 3rem;
  background: #000000;
  font-size: 3rem;
`;

const Header = function Header() {
  return (
    <Head>
      Euclid
    </Head>
  );
};

export default Header;
