import React from 'react';
import { shallow } from 'enzyme';
import GetTickersSearchField from '../GetTickersSearchField';

let component;

beforeEach(() => {
  component = shallow(
    <GetTickersSearchField onTickerSelect={() => {}} />,
  );
});

test('GetTickersSearchField basic', () => {
  expect(component).toMatchSnapshot();
});
