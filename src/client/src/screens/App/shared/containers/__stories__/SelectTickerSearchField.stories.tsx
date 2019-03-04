import { storiesOf } from '@storybook/react';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { rootReducer } from 'App/reducer';
import getTickersQuery from 'App/shared/queries/getTickersQuery';
import SelectTickerSearchField from '../SelectTickerSearchField';

const store = createStore(rootReducer);

const apolloMocks = [
  {
    request: {
      query: getTickersQuery,
    },
    result: {
      data: {
        tickers: ['AAPL', 'SPY', 'AMZN', 'GOOG', 'YELP', 'MSFT'],
      },
    },
  },
];

storiesOf('App/shared/containers/SelectTickerSearchField', module).addWithJSX(
  'SelectTickerSearchField',
  () => (
    <MockedProvider mocks={apolloMocks}>
      <Provider store={store}>
        {
          // disabling because the react-redux types are broken
          // tslint:disable-next-line no-unsafe-any
          <SelectTickerSearchField />
        }
      </Provider>
    </MockedProvider>
  ),
);
