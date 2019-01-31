import React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import SearchField from '../SearchField';


const categories = [
  { value: 'stocks', label: 'Stocks' },
];

const tickerOptions = [
  { value: 'GOOG', label: 'GOOG' },
  { value: 'AAPL', label: 'AAPL' },
  { value: 'AMZN', label: 'AMZN' },
  { value: 'SPY', label: 'SPY' },
];

let selectedCategory = null;
let selectedSearchItem = null;

let component;

const handleChangeCategory = (newCategory) => {
  selectedCategory = newCategory;
  return selectedCategory;
};

const handleChangeSearchItem = (newSearchItem) => {
  selectedSearchItem = newSearchItem;
  return selectedSearchItem;
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
