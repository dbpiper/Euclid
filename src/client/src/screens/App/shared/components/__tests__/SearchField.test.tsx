import { mount } from 'enzyme';
import 'jest-styled-components';
import React from 'react';
import SearchField, {
  HandleChangeSelectFunction,
  ISelectElement,
} from '../SearchField';

const categories = [{ value: 'stocks', label: 'Stocks' }];

const tickerOptions = [
  { value: 'GOOG', label: 'GOOG' },
  { value: 'AAPL', label: 'AAPL' },
  { value: 'AMZN', label: 'AMZN' },
  { value: 'SPY', label: 'SPY' },
];

type NullableSelectElement = ISelectElement | undefined;

let selectedCategory: NullableSelectElement;
let selectedSearchItem: NullableSelectElement;

let component: any;

const handleChangeCategory: HandleChangeSelectFunction = (
  selected?: ISelectElement | ISelectElement[] | null,
) => {
  selectedCategory = selected as NullableSelectElement;
};

const handleChangeSearchItem: HandleChangeSelectFunction = (
  selected?: ISelectElement | ISelectElement[] | null,
) => {
  selectedSearchItem = selected as NullableSelectElement;
};

beforeEach(() => {
  component = mount(
    <SearchField
      options={tickerOptions}
      categories={categories}
      handleChangeCategory={handleChangeCategory}
      handleChangeSearchItem={handleChangeSearchItem}
      selectedCategory={selectedCategory}
      selectedSearchItem={selectedSearchItem}
    />,
  );
});

test('SearchField basic', () => {
  expect(component).toMatchSnapshot();
});
