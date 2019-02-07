// tslint:disable no-magic-numbers

import fetchMock from 'fetch-mock';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import fetchStock from '../fetchStock';

const readFile = promisify(fs.readFile);

describe('should be able to get data from iex', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test('fetch one data point from iex', async () => {
    const stockData = [
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
    ];

    // there is a bug in the `iex-api` code that adds an extra '/' after '1.0'
    fetchMock.get('https://api.iextrading.com/1.0//stock/AAPL/chart/5y', {
      body: JSON.stringify(stockData),
      headers: {
        'content-type': 'application/json',
      },
    });

    const stockResult = await fetchStock('AAPL', '5y');
    expect(stockResult).toEqual({
      data: stockData,
      ticker: 'AAPL',
    });
  });

  test('fetch 5y from iex', async () => {
    const fiveYearAaplJson: string = await readFile(
      path.join(__dirname, '../mockData/5y.json'),
      'utf8',
    );

    // there is a bug in the `iex-api` code that adds an extra '/' after '1.0'
    fetchMock.get('https://api.iextrading.com/1.0//stock/AAPL/chart/5y', {
      body: fiveYearAaplJson,
      headers: {
        'content-type': 'application/json',
      },
    });

    // const data = await fetch('https://api.iextrading.com/1.0/stock/aapl/chart/5y');
    const stockResult = await fetchStock('AAPL', '5y');
    expect(stockResult).toEqual({
      data: JSON.parse(fiveYearAaplJson),
      ticker: 'AAPL',
    });
  });
});

export {};
