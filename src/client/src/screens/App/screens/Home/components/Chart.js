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
import _ from 'lodash';

import TimeWindow from '../shared/TimeWindow';

const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  borderColor: '#5d5d5d',
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

  static dayMonthFormat(unixTime) {
    const month = moment.unix(unixTime).format('MMMM D');

    if (month.length < 6) {
      return month;
    }

    return moment.unix(unixTime).format('MMM. D');
  }

  static longDayMonthFormat(unixTime) {
    const month = moment.unix(unixTime).format('MMMM D');
    return month;
  }

  static formatXAxis(unixTime, firstDate) {
    const elapsedMonths = moment().diff(moment.unix(firstDate), 'months');

    if (elapsedMonths < 3) {
      return Chart.longDayMonthFormat(unixTime);
    }
    if (elapsedMonths < 7) {
      return Chart.dayMonthFormat(unixTime);
    }

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
            stocks(where: {
              date_gt: ${getEarliestTime(timeWindow)}
              ticker: "AAPL"
            }) {
                id
                price
                date
                ticker
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

          let stocksCache = [];
          let { stocks } = data;
          let firstDate = moment(`01/01/${moment().year()}`, 'MM/DD/YYYY')
            .unix();

          // data is an empty object
          // or there is no relevant data in the DB
          if ((data && !data.stocks) || stocks.length === 0) {
            stocks = [{ ticker: '' }];
          }

          if (stocks && stocks.length > 0) {
            stocksCache = R.map((stockElem) => {
              const tickerObj = {
                date: stockElem.date,
              };
              // make mapping from ticker to price for Recharts to draw
              tickerObj[stockElem.ticker] = stockElem.price;
              return tickerObj;
            }, stocks);

            firstDate = _.first(_.sortBy(stocksCache, ['date'])).date;
          }

          return (
            <LineChart
              width={730}
              height={250}
              data={stocksCache}
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
                  unixTime => Chart.formatXAxis(unixTime, firstDate)
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
                  moment.unix(value).format('MMMM D, YYYY')
                )}
              />
              <Legend />
              <Line dot={false} type="monotone" dataKey={_.first(stocks).ticker} stroke="#8884d8" />
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
