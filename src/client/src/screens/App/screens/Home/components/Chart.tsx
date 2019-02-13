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
  getFirstDateInStocks,
  reactTextToNumber,
  unixTimeToDate,
} from '../util/dateFormatting';
import {
  convertStocksToKeyedStocks,
  getTickerFromStocks,
} from '../util/stockFormatting';

class StocksQuery extends Query<Stocks, StocksVariables> {}

interface IChartProps {
  timeWindow: string;
  selectedTicker: string;
}

const darkTooltipContentStyle = {
  backgroundColor: '#18181a',
  borderColor: '#5d5d5d',
};

class Chart extends React.Component<IChartProps, void> {
  public static defaultProps = {
    timeWindow: TimeWindow.ThreeYears,
    selectedTicker: 'AAPL',
  };

  public static propTypes = {
    timeWindow: PropTypes.string,
    selectedTicker: PropTypes.string,
  };

  public static formatXAxis(unixTime: number, firstDate: number) {
    return getDateFormat(unixTime, firstDate);
  }

  constructor(props: IChartProps) {
    super(props);
  }

  public render() {
    const { timeWindow, selectedTicker } = this.props;
    return (
      <StocksQuery
        query={getStocksQuery}
        variables={{
          ticker: selectedTicker,
          earliestDate: getEarliestDate(timeWindow),
        }}
      >
        {({ error, data }) => {
          if (error) return <p>Error :(</p>;

          const baseStocks: IStock[] = [
            {
              ticker: '',
              date: 0,
              price: 0,
            },
          ];
          let stocks = baseStocks;

          if (
            typeof data !== 'undefined' &&
            typeof data.stocks !== 'undefined'
          ) {
            ({ stocks } = data as IStockQueryData);
          }

          const xTickFormatter = (unixTime: number) => {
            const firstDate = getFirstDateInStocks(stocks);
            return Chart.formatXAxis(unixTime, firstDate);
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
