import React from 'react';
import { shallow } from 'enzyme';
// import { mount } from 'enzyme';
import Header from '../Header';

test('Header has correct title', () => {
  const component = shallow(
    <Header />,
  );

  expect(component.text()).toMatch('Euclid');
  expect(component).toMatchSnapshot();
});
