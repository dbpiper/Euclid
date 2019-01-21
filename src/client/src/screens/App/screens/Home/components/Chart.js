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
// import * as R from 'ramda';
import moment from 'moment';
// import _ from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const ChartSection = styled.section`
  background-color: #111111;
  width: 60%;
  height: 100%;
  margin: auto;
  display: block;
`;

const ChartBody = styled.div`
  width: 730px;
  height: 250px;
  margin: auto;
  padding-top: 10%;
`;


const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  opacity: 1,
  borderBottomColor: '#3d3d3d',
  borderTopColor: '#3d3d3d',
  borderLeftColor: '#3d3d3d',
  borderRightColor: '#3d3d3d',
};

class Chart extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Query
        query={gql`
          query {
            stockList(where: {
              ticker: "AAPL"
            }) {
              ticker
              stocks {
                id
                price
                date
              }
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <ChartSection>
              <ChartBody>
                <LineChart
                  width={730}
                  height={250}
                  data={data.stockList.stocks}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="#3d3d3d"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    scale="time"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    interval="preserveEnd"
                    tick={{ stroke: 'none', fill: '#c0bebb' }}
                    minTickGap={30}
                    maxTickGap={62}
                    tickFormatter={
                      (unixTime) => {
                        const month = moment.unix(unixTime).format('MMMM');

                        if (month.length < 6) {
                          return month;
                        }

                        return moment.unix(unixTime).format('MMM.');
                      }
                    }
                  />
                  <YAxis
                    dataKey="price"
                    tick={{ stroke: 'none', fill: '#c0bebb' }}
                  />
                  <Tooltip
                    contentStyle={darkTooltipContentStyle}
                  />
                  <Legend />
                  <Line dot={false} type="monotone" dataKey="price" stroke="#8884d8" />
                  {/* <Line dot={false} type="monotone" dataKey="Dow" stroke="#82ca9d" /> */}
                </LineChart>
              </ChartBody>
            </ChartSection>
          );
        }}
      </Query>

    );
  }
}

export default Chart;
