import React from 'react';

import styled from 'styled-components';


const ChartSection = styled.section`
  text-align: center;
  background-color: #111111;
  width: 60%;
  height: 100%;
  margin: auto;
`;

const ChartBody = styled.div`
  margin: 0;
  margin-right: -50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(0, -50%);
  font-size: 2rem;
`;

const Chart = function Chart() {
  return (
    <ChartSection>
      <ChartBody>
        Chart
      </ChartBody>
    </ChartSection>
  );
};

export default Chart;
