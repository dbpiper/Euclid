// tslint:disable no-magic-numbers

import formatStockData from '../formatStockData';

describe('should format stock data', () => {
  test('works with only the required fields present', () => {
    const inputData = {
      ticker: 'HELLO WORLD!',
      data: [
        {
          date: '2019-02-07',
          vwap: 42,
        },
      ],
    };
    const expectedOutputData = [
      {
        // the date above formatted as a unix timestamp
        // *note* that this is only accurate to the day, not to the hour,
        // minute, or second level. Thus, it is in essence the time stamp
        // at midnight (the start of the day in UTC) on the day in question (above).
        date: 1549497600,
        price: 42,
        ticker: 'HELLO WORLD!',
      },
    ];
    const actualOutputData = formatStockData(inputData);
    expect(actualOutputData).toEqual(expectedOutputData);
  });

  test('works with some real data, with all fields present', () => {
    const inputData = {
      ticker: 'AAPL',
      data: [
        {
          date: '2014-02-07',
          open: 68.7675,
          high: 68.972,
          low: 68.2399,
          close: 68.5433,
          volume: 93638601,
          unadjustedVolume: 13376943,
          change: 0.945686,
          changePercent: 1.399,
          vwap: 68.8015,
          label: 'Feb 7, 14',
          changeOverTime: 0,
        },
      ],
    };
    const expectedOutputData = [
      {
        // the date above formatted as a unix timestamp
        // *note* that this is only accurate to the day, not to the hour,
        // minute, or second level. Thus, it is in essence the time stamp
        // at midnight (the start of the day in UTC) on the day in question (above).
        date: 1391731200,
        price: 68.8015,
        ticker: 'AAPL',
      },
    ];
    const actualOutputData = formatStockData(inputData);
    expect(actualOutputData).toEqual(expectedOutputData);
  });

  test('combo of the two previous ones', () => {
    const inputData = {
      ticker: 'AAPL',
      data: [
        {
          date: '2014-02-07',
          open: 68.7675,
          high: 68.972,
          low: 68.2399,
          close: 68.5433,
          volume: 93638601,
          unadjustedVolume: 13376943,
          change: 0.945686,
          changePercent: 1.399,
          vwap: 68.8015,
          label: 'Feb 7, 14',
          changeOverTime: 0,
        },
        {
          date: '2019-02-07',
          vwap: 42,
        },
      ],
    };
    const expectedOutputData = [
      {
        date: 1391731200,
        price: 68.8015,
        ticker: 'AAPL',
      },
      {
        date: 1549497600,
        price: 42,
        ticker: 'AAPL',
      },
    ];
    const actualOutputData = formatStockData(inputData);
    expect(actualOutputData).toEqual(expectedOutputData);
  });
});
