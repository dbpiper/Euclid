import { SELECT_TICKER } from 'App/actionTypes';

export interface ITickersReducerState {
  ticker: string;
}

export const tickers = (
  state: ITickersReducerState = {
    ticker: 'AAPL',
  },
  action: { type: string; ticker: string },
) => {
  switch (action.type) {
    case SELECT_TICKER:
      return {
        ...state,
        ticker: action.ticker,
      };
    default:
      return state;
  }
};

export default tickers;
