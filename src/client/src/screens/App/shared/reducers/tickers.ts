import { SELECT_TICKER } from 'App/actionTypes';

export const tickers = (state = {}, action: { type: string, ticker: string}) => {
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
