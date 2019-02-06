import { shallow } from 'enzyme';
import React from 'react';
import Header from '../Header';

test('Header has correct title', () => {
  const component = shallow(
    <Header />,
  );

  expect(component.text()).toMatch('Euclid');
  expect(component).toMatchSnapshot();
});
