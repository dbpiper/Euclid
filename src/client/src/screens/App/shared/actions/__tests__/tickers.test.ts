// import { selectTicker } from 'shared/actions/tickers';
import { SELECT_TICKER } from 'App/actionTypes';
import { selectTicker } from 'App/shared/actions/tickers';

describe('tickers action creator', () => {
  test('creates an action to select a ticker', () => {
    const ticker = 'AAPL';
    const expectedAction = {
      ticker,
      type: SELECT_TICKER,
    };
    expect(selectTicker(ticker)).toEqual(expectedAction);
  });
});
