import { storiesOf } from '@storybook/react';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { rootReducer } from 'App/reducer';
import getStocksQuery from 'App/screens/Home/queries/getStocksQuery';
import TimeWindow from 'App/screens/Home/shared/TimeWindow';
import ChartGroup from '../ChartGroup';

import aapl1YearData from './mock-data/aapl-1year';
import aapl3YearData from './mock-data/aapl-3year';
import aapl5YearData from './mock-data/aapl-5year';
import aapl6MonthData from './mock-data/aapl-6month';
import aaplAllTimeData from './mock-data/aapl-all-time';
import aaplYTDData from './mock-data/aapl-ytd';

const store = createStore(rootReducer);

const timeWindow = TimeWindow.ThreeYears;

const oneYear = 1520182497;
const threeYears = 1457110497;
const fiveYears = 1393952097;
const sixMonths = 1536080097;
const allTime = 0;
const ytd = 1546300800;
const unixTimeOnMarch420195PM = 1551718497;
const getTestDate = () => unixTimeOnMarch420195PM;

const apolloMocks = [
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: oneYear,
      },
    },
    result: {
      data: aapl1YearData,
    },
  },
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: threeYears,
      },
    },
    result: {
      data: aapl3YearData,
    },
  },
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: fiveYears,
      },
    },
    result: {
      data: aapl5YearData,
    },
  },
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: sixMonths,
      },
    },
    result: {
      data: aapl6MonthData,
    },
  },
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: allTime,
      },
    },
    result: {
      data: aaplAllTimeData,
    },
  },
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: ytd,
      },
    },
    result: {
      data: aaplYTDData,
    },
  },
];

storiesOf('App/screens/Home/components/ChartGroup', module).addWithJSX(
  'ChartGroup',
  () => (
    <MockedProvider mocks={apolloMocks} addTypename={false}>
      <Provider store={store}>
        {
          // tslint:disable no-unsafe-any
          // disabling because we don't have a working typing for
          // connect from react-redux which breaks SelectedTickerChart
          <ChartGroup timeWindow={timeWindow} getDateTime={getTestDate} />}
      </Provider>
    </MockedProvider>
  ),
);
