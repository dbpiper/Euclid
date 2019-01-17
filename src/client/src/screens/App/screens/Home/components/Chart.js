import React from 'react';

import styled from 'styled-components';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
  Legend,
  Line,
} from 'recharts';
import faker from 'faker';
import * as R from 'ramda';
import moment from 'moment';

const ChartSection = styled.section`
  background-color: #111111;
  width: 60%;
  height: 100%;
  margin: auto;
`;

const ChartBody = styled.div`
  display: block;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  left: 33%;
  transform: translate(0, -50%);
  margin-right: -50%;
`;


const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  opacity: 1,
  borderBottomColor: '#3d3d3d',
  borderTopColor: '#3d3d3d',
  borderLeftColor: '#3d3d3d',
  borderRightColor: '#3d3d3d',
};

const generateData = function generateData() {
  const fakeArray = [];
  const pvStart = faker.random.number();
  const uvStart = faker.random.number();

  R.range(1, 365 * 2).forEach((num) => {
    fakeArray.push({
      name: num,
      pv: pvStart * (2 + num),
      uv: uvStart * (2 * num),
    });
  });
  console.log(fakeArray);
  return fakeArray;
};

const chartData = generateData();

const Chart = function Chart() {
  return (
    <ChartSection>
      <ChartBody>
        <LineChart
          width={730}
          height={250}
          data={chartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            scale="time"
            type="number"
            domain={['dataMin', 'dataMax']}
            interval={90}
            // minTickGap={30}
            // maxTickGap={30}
            tickFormatter={tickNum => moment((Math.round(tickNum / 30) % 12) + 1, 'MM').format('MMMM')}
            // tickFormatter={tickNum => Math.round(tickNum / 30)}
          />
          <YAxis />
          <Tooltip
            contentStyle={darkTooltipContentStyle}
          />
          <Legend />
          <Line dot={false} type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line dot={false} type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ChartBody>
    </ChartSection>
  );
};

export default Chart;
