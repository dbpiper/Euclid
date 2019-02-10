import gql from 'graphql-tag';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React, { ReactText } from 'react';
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
  date: number;
}

interface IStockQueryData {
  stocks: IStock[];
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

// cSpell:disable
interface IChartPropTypes {
  timeWindow: PropTypes.Requireable<string>;
  selectedTicker: PropTypes.Requireable<string>;
}
// cSpell:enable


const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  borderColor: '#5d5d5d',
};

const getEarliestTime = (timeWindow: string) => {
  const sixMonths = 6;
  const oneYear = 1;
  const threeYears = 3;
  const fiveYears = 5;

  switch (timeWindow) {
    case TimeWindow.AllTime:
      return 0;
    case TimeWindow.YTD:
      return moment.utc(`01/01/${moment.utc().year()}`, 'MM/DD/YYYY').unix();
    case TimeWindow.SixMonths:
      return moment
        .utc()
        .subtract(sixMonths, 'months')
        .unix();
    case TimeWindow.OneYear:
      return moment
        .utc()
        .subtract(oneYear, 'year')
        .unix();
    case TimeWindow.ThreeYears:
      return moment
        .utc()
        .subtract(threeYears, 'years')
        .unix();
    case TimeWindow.FiveYears:
      return moment
        .utc()
        .subtract(fiveYears, 'years')
        .unix();
    default:
      return 0;
  }
};

class Chart extends React.Component<IChartProps, void> {
  public static defaultProps: IChartProps;
  public static propTypes: IChartPropTypes;

  public static monthFormat(unixTime: number) {
    const longestShortMonthName = 6;
    const month = moment
      .unix(unixTime)
      .utc()
      .format('MMMM');

    if (month.length < longestShortMonthName) {
      return month;
    }

    return moment
      .unix(unixTime)
      .utc()
      .format('MMM.');
  }

  public static dayMonthFormat(unixTime: number) {
    const longestShortMonthName = 6;
    const month = moment
      .unix(unixTime)
      .utc()
      .format('MMMM D');

    if (month.length < longestShortMonthName) {
      return month;
    }

    return moment
      .unix(unixTime)
      .utc()
      .format('MMM. D');
  }

  public static longDayMonthFormat(unixTime: number) {
    const month = moment
      .unix(unixTime)
      .utc()
      .format('MMMM D');
    return month;
  }

  public static formatXAxis(unixTime: number, firstDate: number) {
    const longestLongMonthTime = 3;
    const longestMedMonthTime = 7;
    const elapsedMonths = moment
      .utc()
      .diff(moment.unix(firstDate).utc(), 'months');

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

  /**
   * Gets the earliest date in a list of stocks.
   *
   * @static
   * @param {IStock[]} stocks - The list of stocks to get the earliest date of
   * @returns {number} - The earliest date from the list of stocks
   * @memberof Chart
   */
  public static getFirstDate(stocks: ITickerData[]): number {
    let sortedStocks = _.sortBy(stocks, ['date']);
    // we have to do this to keep TypeScript from complaining about undefined
    // type
    if (typeof sortedStocks === 'undefined') {
      sortedStocks = stocks;
    }
    let firstStock = _.first(sortedStocks);
    if (typeof firstStock === 'undefined') {
      firstStock = sortedStocks[0];
    }

    return firstStock.date;
  }

  constructor(props: IChartProps) {
    super(props);
  }

  public render() {
    const { timeWindow, selectedTicker } = this.props;
    return (
      <Query
        // tslint:disable-next-line no-unsafe-any
        query={gql`
          query {
            stocks(ticker: "${selectedTicker}", earliestDate: ${getEarliestTime(
              timeWindow,
        )}) {
              price
              date
              ticker
            }
          }
        `}
      >
        {({ error, data }) => {
          if (error) return <p>Error :(</p>;

          let stocksCache = [] as ITickerData[];
          const baseStocks: IStock[] = [
            {
              ticker: '',
              date: 0,
              price: 0,
            },
          ];
          let stocks = baseStocks;
          ({ stocks } = data as IStockQueryData);

          if (typeof stocks === 'undefined') {
            stocks = baseStocks;
          }

          let firstDate: number = moment
            .utc(`01/01/${moment.utc().year()}`, 'MM/DD/YYYY')
            .unix();

          if (stocks && stocks.length > 0) {
            // prettier-ignore
            stocksCache = R.map((stockElem) => {
              const tickerObj: ITickerData = {
                date: stockElem.date,
              };
              // make mapping from ticker to price for Recharts to draw
              tickerObj[stockElem.ticker] = stockElem.price;
              return tickerObj;
            }, stocks);

            firstDate = Chart.getFirstDate(stocksCache);
          }

          const xTickFormatter = (unixTime: number) => {
            return Chart.formatXAxis(unixTime, firstDate);
          };
          const yTickFormatter = (tick: string) => {
            return `$${tick}`;
          };
          const tooltipFormatter = (price: ReactText | ReactText[]) => {
            let priceTextArray: ReactText[];
            let priceReactText: ReactText;
            let priceNumber: number;
            if (typeof price !== 'string' && price.hasOwnProperty('length')) {
              priceTextArray = price as ReactText[];
              priceReactText = priceTextArray[0];
            } else {
              priceReactText = price as ReactText;
            }

            if (
              (typeof price === 'string' || typeof price === 'object') &&
              typeof priceReactText !== 'number'
            ) {
              priceNumber = Number.parseFloat(priceReactText);
            } else {
              priceNumber = price as number;
            }
            return `$${priceNumber}`;
          };
          const tooltipLabelFormatter = (date: ReactText): string => {
            let _date: number;
            if (typeof date === 'string' || typeof date === 'object') {
              _date = Number.parseFloat(date);
            } else {
              _date = date;
            }
            return moment
              .unix(_date)
              .utc()
              .format('MMMM D, YYYY');
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
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid stroke="#3d3d3d" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                scale="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                interval="preserveEnd"
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
                type="monotone"
                dataKey={Chart.getTicker(stocks)}
                stroke="#8884d8"
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
