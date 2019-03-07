import { storiesOf } from '@storybook/react';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { rootReducer } from 'App/reducer';
import getStocksQuery from 'App/screens/Home/queries/getStocksQuery';
import TimeWindow from 'App/screens/Home/shared/TimeWindow';
import SelectedTickerChart from '../SelectedTickerChart';
import aapl3YearData from './mock-data/aapl-3year';

const store = createStore(rootReducer);

const timeWindow = TimeWindow.ThreeYears;
const unixTimeOnMarch420165PM = 1457110497; // 1551623802600
const unixTimeOnMarch420195PM = 1551718497;
const getTestDate = () => unixTimeOnMarch420195PM;

const apolloMocks = [
  {
    request: {
      query: getStocksQuery,
      variables: {
        ticker: 'AAPL',
        earliestDate: unixTimeOnMarch420165PM,
      },
    },
    result: {
      data: aapl3YearData,
    },
  },
];

storiesOf('App/screens/Home/containers/SelectedTickerChart', module).addWithJSX(
  'SelectedTickerChart',
  () => (
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <Provider store={store}>
          {
            // tslint:disable no-unsafe-any
            // disabling because we don't have a working typing for
            // connect from react-redux which breaks SelectedTickerChart
            <SelectedTickerChart
              timeWindow={timeWindow}
              getDateTime={getTestDate}
            />
          }
        </Provider>
      </MockedProvider>
  ),
);
