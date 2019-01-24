import React from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
  Legend,
  Line,
} from 'recharts';
import * as R from 'ramda';
import moment from 'moment';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import TimeWindow from '../shared/TimeWindow';

const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  opacity: 1,
  borderBottomColor: '#3d3d3d',
  borderTopColor: '#3d3d3d',
  borderLeftColor: '#3d3d3d',
  borderRightColor: '#3d3d3d',
};

const getEarliestTime = (timeWindow) => {
  switch (timeWindow) {
    case TimeWindow.AllTime:
      return 0;
    case TimeWindow.YTD:
      return moment(`01/01/${moment().year()}`, 'MM/DD/YYYY').unix();
    case TimeWindow.SixMonths:
      return moment().subtract(6, 'months').unix();
    case TimeWindow.OneYear:
      return moment().subtract(1, 'year').unix();
    case TimeWindow.ThreeYears:
      return moment().subtract(3, 'years').unix();
    case TimeWindow.FiveYears:
      return moment().subtract(5, 'years').unix();
    default:
      return 0;
  }
};

class Chart extends React.Component {
  static monthFormat(unixTime) {
    const month = moment.unix(unixTime).format('MMMM');

    if (month.length < 6) {
      return month;
    }

    return moment.unix(unixTime).format('MMM.');
  }

  static formatXAxis(unixTime) {
    return Chart.monthFormat(unixTime);
  }

  constructor() {
    super();
    this.state = {
    };
  }


  render() {
    const { timeWindow } = this.props;
    return (
      <Query
        query={gql`
          query {
            stockList(where: { ticker: "AAPL"}) {
              ticker
              stocks(where: {date_gt: ${getEarliestTime(timeWindow)}}) {
                id
                price
                date
              }
            }
          }
        `}
      >
        {({
          loading,
          error,
          data,
        }) => {
          if (loading && error === false) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          let tickerStocks = [];
          let { stockList } = data;

          if (!(data.stockList && data.stockList.ticker
            && data.stockList.stocks)) {
            stockList = {
              ticker: '',
              stocks: [],
            };
          }

          if (stockList.stocks.length > 0) {
            tickerStocks = R.map((stockElem) => {
              const tickerObj = {
                date: stockElem.date,
              };
              tickerObj[data.stockList.ticker] = stockElem.price;
              return tickerObj;
            }, stockList.stocks);
          }

          return (
            <LineChart
              width={730}
              height={250}
              data={tickerStocks}
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
                  unixTime => Chart.formatXAxis(unixTime)
                }
              />
              <YAxis
                tick={{ stroke: 'none', fill: '#c0bebb' }}
                tickFormatter={tick => `$${tick}`}
              />
              <Tooltip
                contentStyle={darkTooltipContentStyle}
                formatter={value => (`$${value}`)}
                labelFormatter={value => (
                  moment.unix(value).format('MMMM DD, YYYY')
                )
                }
              />
              <Legend />
              <Line dot={false} type="monotone" dataKey={stockList.ticker} stroke="#8884d8" />
            </LineChart>
          );
        }}
      </Query>
    );
  }
}

Chart.defaultProps = {
  timeWindow: TimeWindow.ThreeYears,
};

Chart.propTypes = {
  timeWindow: PropTypes.string,
};

export default Chart;
