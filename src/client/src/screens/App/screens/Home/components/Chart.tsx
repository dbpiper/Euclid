import moment from 'moment';
import PropTypes from 'prop-types';
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

import getStocksQuery from '../queries/getStocksQuery';
import { Stocks, StocksVariables } from '../queries/types/Stocks';
import TimeWindow from '../shared/TimeWindow';
import { IStock, IStockQueryData } from '../types/StockInterfaces';
import {
  getDateFormat,
  getEarliestDate,
  getEarliestDateInStocks,
  reactTextToNumber,
  unixTimeToDate,
} from '../util/date-formatting';
import {
  convertStocksToKeyedStocks,
  getTickerFromStocks,
} from '../util/stock-formatting';

class StocksQuery extends Query<Stocks, StocksVariables> {}

interface IChartProps {
  timeWindow: string;
  selectedTicker: string;
  // we pass in a function to tell us the date
  // as a unix timestamp
  // normally it will just return the current datetime
  getDateTime: () => number;
}

const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  borderColor: '#5d5d5d',
};

class Chart extends React.Component<IChartProps, void> {
  public static defaultProps = {
    timeWindow: TimeWindow.ThreeYears,
    selectedTicker: 'AAPL',
    getDateTime: () => moment.utc().unix(),
  };

  public static propTypes = {
    timeWindow: PropTypes.string,
    selectedTicker: PropTypes.string,
  };

  public static formatXAxis(unixTime: number, earliestDate: number) {
    return getDateFormat(unixTime, earliestDate);
  }

  constructor(props: IChartProps) {
    super(props);
  }

  public render() {
    const { timeWindow, selectedTicker, getDateTime } = this.props;
    return (
      <StocksQuery
        query={getStocksQuery}
        variables={{
          ticker: selectedTicker,
          earliestDate: getEarliestDate(timeWindow, getDateTime()),
        }}
      >
        {({ loading, error, data }) => {
          if (error) return <p>Error :(</p>;

          const baseStocks: IStock[] = [
            {
              ticker: '',
              date: 0,
              price: 0,
            },
          ];
          let stocks = baseStocks;

          if (!loading) {
            if (
              typeof data !== 'undefined' &&
              typeof data.stocks !== 'undefined'
            ) {
              ({ stocks } = data as IStockQueryData);
            }
          }

          const xTickFormatter = (unixTime: number) => {
            const earliestDate = getEarliestDateInStocks(stocks);
            return Chart.formatXAxis(unixTime, earliestDate);
          };

          const yTickFormatter = (tick: string) => {
            return `$${tick}`;
          };

          const tooltipFormatter = (price: ReactText | ReactText[]) => {
            const priceNumber = reactTextToNumber(price);
            return `$${priceNumber}`;
          };

          const tooltipLabelFormatter = (date: ReactText): string => {
            const dateNumber = reactTextToNumber(date);
            return unixTimeToDate(dateNumber);
          };

          const width = 730;
          const height = 250;
          const minTickGap = 30;

          return (
            <LineChart
              width={width}
              height={height}
              data={convertStocksToKeyedStocks(stocks)}
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
                dataKey={getTickerFromStocks(stocks)}
                stroke="#8884d8"
              />
            </LineChart>
          );
        }}
      </StocksQuery>
    );
  }
}

export default Chart;
