import gql from 'graphql-tag';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React from 'react';
import { Query } from 'react-apollo';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import TimeWindow from '../shared/TimeWindow';

interface ITickerData {
  [key: string]: number;
}

interface IStock {
  date: number;
  ticker: string;
  price: number;
}

interface IChartProps {
  timeWindow: string;
  selectedTicker: string;
}

interface IChartPropTypes {
  timeWindow: PropTypes.Requireable<string>;
  selectedTicker: PropTypes.Requireable<string>;
}

const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  borderColor: '#5d5d5d',
};

const getEarliestTime = (timeWindow: any) => {
  const sixMonths = 6;
  const oneYear = 1;
  const threeYears = 3;
  const fiveYears = 5;

  switch (timeWindow) {
    case TimeWindow.AllTime:
      return 0;
    case TimeWindow.YTD:
      return moment(`01/01/${moment().year()}`, 'MM/DD/YYYY').unix();
    case TimeWindow.SixMonths:
      return moment().subtract(sixMonths, 'months').unix();
    case TimeWindow.OneYear:
      return moment().subtract(oneYear, 'year').unix();
    case TimeWindow.ThreeYears:
      return moment().subtract(threeYears, 'years').unix();
    case TimeWindow.FiveYears:
      return moment().subtract(fiveYears, 'years').unix();
    default:
      return 0;
  }
};

class Chart extends React.Component<IChartProps, any> {
  public static defaultProps: IChartProps;
  public static propTypes: IChartPropTypes;

  public static monthFormat(unixTime: number) {
    const longestShortMonthName = 6;
    const month = moment.unix(unixTime).format('MMMM');

    if (month.length < longestShortMonthName) {
      return month;
    }

    return moment.unix(unixTime).format('MMM.');
  }

  public static dayMonthFormat(unixTime: number) {
    const longestShortMonthName = 6;
    const month = moment.unix(unixTime).format('MMMM D');

    if (month.length < longestShortMonthName) {
      return month;
    }

    return moment.unix(unixTime).format('MMM. D');
  }

  public static longDayMonthFormat(unixTime: number) {
    const month = moment.unix(unixTime).format('MMMM D');
    return month;
  }

  public static formatXAxis(unixTime: number, firstDate: number) {
    const longestLongMonthTime = 3;
    const longestMedMonthTime = 7;
    const elapsedMonths = moment().diff(moment.unix(firstDate), 'months');

    if (elapsedMonths < longestLongMonthTime) {
      return Chart.longDayMonthFormat(unixTime);
    }
    if (elapsedMonths < longestMedMonthTime) {
      return Chart.dayMonthFormat(unixTime);
    }

    return Chart.monthFormat(unixTime);
  }

  public static getTicker(stocks: IStock[]) {
    let first = _.first(stocks);
    if (typeof first === 'undefined') {
      first = stocks[0];
    }
    return first.ticker;
  }

  constructor(props: IChartProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const { timeWindow, selectedTicker } = this.props;
    return (
      <Query
        query={gql`
          query {
            stocks(ticker: "${selectedTicker}", earliestDate: ${getEarliestTime(timeWindow)}) {
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
          if (loading && typeof error === 'undefined') return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          let stocksCache = [] as any[];
          const baseStocks: IStock[] = [
            {
              ticker: '',
              date: 0,
              price: 0,
            },
          ];
          let stocks = baseStocks;
          // stocks = data.stocks;
          ({ stocks } = data);

          if (typeof stocks === 'undefined') {
            stocks = baseStocks;
          }

          let firstDate = moment(`01/01/${moment().year()}`, 'MM/DD/YYYY')
            .unix();

          if (stocks && stocks.length > 0) {
            stocksCache = R.map((stockElem) => {
              const tickerObj: ITickerData = {
                date: stockElem.date,
              };
              // make mapping from ticker to price for Recharts to draw
              tickerObj[stockElem.ticker] = stockElem.price;
              return tickerObj;
            }, stocks);

            firstDate = _.first(_.sortBy(stocksCache, ['date'])).date;
          }

          const xTickFormatter = (unixTime: number) => {
            return Chart.formatXAxis(unixTime, firstDate);
          };
          const yTickFormatter = (tick: string) => {
            return `$${tick}`;
          };
          const tooltipFormatter = (value: any) => {
            return `$${value}`;
          };
          const tooltipLabelFormatter = (date: any) => {
            return moment.unix(date).format('MMMM D, YYYY');
          };
          const width = 730;
          const height = 250;
          const minTickGap = 30;

          return (
            <LineChart
              width={width}
              height={height}
              data={stocksCache}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid
                stroke='#3d3d3d'
                strokeDasharray='3 3'
              />
              <XAxis
                dataKey='date'
                scale='time'
                type='number'
                domain={['dataMin', 'dataMax']}
                interval='preserveEnd'
                tick={{ stroke: 'none', fill: '#c0bebb' }}
                minTickGap={minTickGap}
                tickFormatter={xTickFormatter}
              />
              <YAxis
                tick={{ stroke: 'none', fill: '#c0bebb' }}
                tickFormatter={yTickFormatter}
              />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={tooltipLabelFormatter}
                contentStyle={darkTooltipContentStyle}
              />
              <Legend />
              <Line
                dot={false}
                type='monotone'
                dataKey={Chart.getTicker(stocks)}
                stroke='#8884d8'
              />
            </LineChart>
          );
        }}
      </Query>
    );
  }
}


Chart.defaultProps = {
  timeWindow: TimeWindow.ThreeYears,
  selectedTicker: 'AAPL',
};

Chart.propTypes = {
  timeWindow: PropTypes.string,
  selectedTicker: PropTypes.string,
};

export default Chart;
