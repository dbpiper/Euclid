// tslint:disable: no-magic-numbers
import moment from 'moment';

import TimeWindow from 'App/screens/Home/shared/TimeWindow';
import _ from 'lodash';
import { IStock } from '../../types/StockInterfaces';
import {
  getDateFormat,
  getEarliestDate,
  getEarliestDateInStocks,
  reactTextToNumber,
  unixTimeToDate,
} from '../date-formatting';

describe('getDateFormat tests', () => {
  let stocks: IStock[] = [];
  beforeAll(() => {
    stocks = [
      {
        date: moment
          .utc({
            year: 1999,
            month: 6, // July
            date: 1,
          })
          .unix(),
        ticker: 'hello world!',
        price: 0,
      },
    ];
  });

  test('gets the long month with 2 months', () => {
    const earliestDate = getEarliestDateInStocks(stocks);
    const timeStamp2Months = moment
      .unix(earliestDate)
      .utc()
      .add(2, 'months')
      .unix();
    expect(
      getDateFormat(timeStamp2Months, timeStamp2Months, earliestDate),
    ).toEqual('September 1');
  });

  test('gets the medium month with 6 months', () => {
    const earliestDate = getEarliestDateInStocks(stocks);
    const timeStamp2Months = moment
      .unix(earliestDate)
      .utc()
      .add(6, 'months')
      .unix();
    expect(
      getDateFormat(timeStamp2Months, earliestDate, timeStamp2Months),
    ).toEqual('Jan. 1');
  });

  test('gets the medium month with 12 months', () => {
    const earliestDate = getEarliestDateInStocks(stocks);
    const timeStamp2Months = moment
      .unix(earliestDate)
      .utc()
      .add(12, 'months')
      .unix();
    expect(
      getDateFormat(timeStamp2Months, earliestDate, timeStamp2Months),
    ).toEqual('July');
  });
});

describe('getEarliestDate test', () => {
  let stocks: IStock[] = [];
  beforeAll(() => {
    stocks = [
      {
        date: moment
          .utc({
            year: 1999,
            month: 6, // July
            date: 1,
          })
          .unix(),
        ticker: 'hello world!',
        price: 0,
      },
    ];
  });

  test('works with 6 months', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(
      TimeWindow.SixMonths,
      stock.date,
    );
    const expectedEarliestDate = moment
      .utc({
        year: 1999,
        month: 0,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('works with 1 year', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(
      TimeWindow.OneYear,
      stock.date,
    );
    const expectedEarliestDate = moment
      .utc({
        year: 1998,
        month: 6,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('works with 1 year', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(
      TimeWindow.OneYear,
      stock.date,
    );
    const expectedEarliestDate = moment
      .utc({
        year: 1998,
        month: 6,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('works with 3 years', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(
      TimeWindow.ThreeYears,
      stock.date,
    );
    const expectedEarliestDate = moment
      .utc({
        year: 1996,
        month: 6,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('works with 5 years', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(
      TimeWindow.FiveYears,
      stock.date,
    );
    const expectedEarliestDate = moment
      .utc({
        year: 1994,
        month: 6,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('works with all time (since unix epoch)', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(
      TimeWindow.AllTime,
      stock.date,
    );
    const expectedEarliestDate = moment
      .utc({
        year: 1970,
        month: 0,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('treats an invalid time window as all time', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate('hello world!', stock.date);
    const expectedEarliestDate = moment
      .utc({
        year: 1970,
        month: 0,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });

  test('works with year to date (YTD)', () => {
    const stock = _.first(stocks) as IStock;
    const earliestDateInWindow = getEarliestDate(TimeWindow.YTD, stock.date);
    const expectedEarliestDate = moment
      .utc({
        year: 1999,
        month: 0,
        date: 1,
      })
      .unix();

    expect(earliestDateInWindow).toBe(expectedEarliestDate);
  });
});

describe('reactTextToNumber tests', () => {
  test('it converts a string to number', () => {
    expect(reactTextToNumber('3.14159')).toBeCloseTo(3.14159);
  });

  test('it converts an array of strings to number', () => {
    expect(reactTextToNumber(['3.14159'])).toBeCloseTo(3.14159);
  });

  test('it keeps a number as a number', () => {
    expect(reactTextToNumber(3.14159)).toBeCloseTo(3.14159);
  });
});

describe('unixTimeToDate tests', () => {
  test('works for some date', () => {
    const unixTimestamp = moment
      .utc({
        year: 2000,
        date: 1,
        month: 2, // March
      })
      .unix();
    const expectedDate = `March 1, 2000`;
    expect(unixTimeToDate(unixTimestamp)).toEqual(expectedDate);
  });
});
