import { shallow } from 'enzyme';
import React from 'react';
import GetTickersSearchField from '../GetTickersSearchField';

let component: any;

// tslint:disable-next-line no-empty
const nothing = () => {};

beforeEach(() => {
  component = shallow(
    <GetTickersSearchField
      onTickerSelect={nothing}
    />,
  );
});

test('GetTickersSearchField basic', () => {
  expect(component).toMatchSnapshot();
});
