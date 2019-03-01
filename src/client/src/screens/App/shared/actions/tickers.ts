import { SELECT_TICKER } from 'App/actionTypes';

export const selectTicker = (ticker: string) => ({
  ticker,
  type: SELECT_TICKER,
});

export default {
  selectTicker,
};
