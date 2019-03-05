import { storiesOf } from '@storybook/react';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { rootReducer } from 'App/reducer';
import Header from 'App/shared/components/Header';
import getTickersQuery from 'App/shared/queries/getTickersQuery';

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

storiesOf('App/shared/components/Header', module).addWithJSX('Header', () => (
  <MockedProvider mocks={apolloMocks}>
    <Provider store={store}>
      <Header />
    </Provider>
  </MockedProvider>
));
