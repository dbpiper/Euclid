import {
  convertStocksToKeyedStocks,
  getTickerFromStocks,
} from '../stock-formatting';

describe('getTickerFromStocks tests', () => {
  test('works with an average list', () => {
    const stockList = [
      {
        date: 35490635,
        ticker: 'MSFT',
        price: 123,
      },
      {
        date: 353322,
        ticker: 'MSFT',
        price: 3569,
      },
      {
        date: 9835392,
        ticker: 'MSFT',
        price: 923,
      },
      {
        date: 259629983,
        ticker: 'MSFT',
        price: 6529,
      },
    ];

    expect(getTickerFromStocks(stockList)).toEqual('MSFT');
  });

  test('works with a one item list', () => {
    const stockList = [
      {
        date: 29865,
        ticker: 'YELP',
        price: 314,
      },
    ];

    expect(getTickerFromStocks(stockList)).toEqual('YELP');
  });

  // this is not the normal or expected use of the function!
  test('gives an empty string with an empty list', () => {
    // just returns an empty string in this case
    expect(getTickerFromStocks([])).toEqual('');
  });

  // this is not the normal or expected use of the function!
  test('works with a list of stocks with different tickers', () => {
    const stockList = [
      {
        date: 35490635,
        ticker: 'AAPL',
        price: 123,
      },
      {
        date: 353322,
        ticker: 'MSFT',
        price: 3569,
      },
      {
        date: 9835392,
        ticker: 'HELLO',
        price: 923,
      },
      {
        date: 259629983,
        ticker: 'SONY',
        price: 6529,
      },
    ];

    // just returns the first one in this case
    expect(getTickerFromStocks(stockList)).toEqual('AAPL');
  });
});

describe('convertStocksToKeyedStocks tests', () => {
  test('works with an empty array', () => {
    expect(convertStocksToKeyedStocks([])).toEqual([]);
  });

  test('works with an average expected case', () => {
    const stockList = [
      {
        date: 35490635,
        ticker: 'AAPL',
        price: 123,
      },
      {
        date: 353322,
        ticker: 'MSFT',
        price: 3569,
      },
      {
        date: 9835392,
        ticker: 'HELLO',
        price: 923,
      },
      {
        date: 259629983,
        ticker: 'SONY',
        price: 6529,
      },
    ];

    const keyedStockList = [
      {
        date: 35490635,
        AAPL: 123,
      },
      {
        date: 353322,
        MSFT: 3569,
      },
      {
        date: 9835392,
        HELLO: 923,
      },
      {
        date: 259629983,
        SONY: 6529,
      },
    ];

    expect(convertStocksToKeyedStocks(stockList)).toEqual(keyedStockList);
  });
});
