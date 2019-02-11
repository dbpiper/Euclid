import { SELECT_TICKER } from 'App/actionTypes';
import { tickers } from '../tickers';

describe('tickers reducer', () => {
  test('should handle SELECT_TICKER action', () => {
    expect(
      tickers(
        {
          ticker: '',
        },
        {
          type: SELECT_TICKER,
          ticker: 'AAPL',
        },
      ),
    ).toEqual({
      ticker: 'AAPL',
    });
  });

  test('should do nothing with an invalid action', () => {
    expect(
      tickers(
        {
          ticker: '',
        },
        {
          type: 'the quick brown fox jumps over the lazy dog',
          ticker: 'abc123',
        },
      ),
    ).toEqual({
      ticker: '',
    });
  });

  test('should select the default ticker:\'AAPL\' if called without one', () => {
    expect(
      tickers(
        undefined,
        {
          type: 'the quick brown fox jumps over the lazy dog',
          ticker: 'abc123',
        },
      ),
    ).toEqual({
      ticker: 'AAPL',
    });
  });
});
