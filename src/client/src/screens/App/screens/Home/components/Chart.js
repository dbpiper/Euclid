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
// import faker from 'faker';
import * as R from 'ramda';
import moment from 'moment';
import { IEXClient } from 'iex-api';
import * as _fetch from 'isomorphic-fetch';
import _ from 'lodash';

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

const generateData = async function generateData() {
  const fakeArray = [];
  // const pvStart = faker.random.number();
  // const uvStart = faker.random.number();
  // let pv = pvStart;
  // let uv = uvStart;

  const dateFormat = 'YYYY-MM-DD';
  const iex = new IEXClient(_fetch);
  const chartApple = await iex.stockChart('AAPL', '2y');
  const chartDoj = await iex.stockChart('DIA', '2y');
  const firstDate = moment(_.first(chartApple).date, dateFormat);
  const joinedChart = R.zip(chartApple, chartDoj);
  R.forEach((elem) => {
    fakeArray.push({
      name: moment(_.first(elem).date, dateFormat).diff(firstDate, 'days'),
      pv: _.first(elem).high,
      uv: _.last(elem).high,
    });
  }, joinedChart);
  console.log('apple');
  console.log(chartApple);
  console.log('doj');
  console.log(chartDoj);
  console.log('zipped');
  console.log(joinedChart);
  console.log('final');
  console.log(fakeArray);
  return fakeArray;
};

class Chart extends React.Component {
  constructor() {
    super();
    this.state = {
      chartData: [],
    };
  }

  async componentDidMount() {
    const chartData = await generateData();
    this.setState({ chartData });
  }

  render() {
    const { chartData } = this.state;
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
            <CartesianGrid
              stroke="#3d3d3d"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              scale="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              interval={90}
              tick={{ stroke: 'none', fill: '#c0bebb' }}
              // minTickGap={30}
              // maxTickGap={30}
              tickFormatter={tickNum => moment((Math.round(tickNum / 30) % 12) + 1, 'MM').format('MMMM')}
              // tickFormatter={tickNum => Math.round(tickNum / 30)}
            />
            <YAxis
              tick={{ stroke: 'none', fill: '#c0bebb' }}
            />
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
  }
}

export default Chart;
