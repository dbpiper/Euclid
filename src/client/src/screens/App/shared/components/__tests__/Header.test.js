import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';

import Header from '../Header';


test('Header has correct title', () => {
  const component = renderer.create(
    <MockedProvider>
      <Provider store={createMockStore()}>
        <Header />
      </Provider>
    </MockedProvider>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
