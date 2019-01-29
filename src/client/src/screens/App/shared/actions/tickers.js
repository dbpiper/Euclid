import { SELECT_TICKER } from 'App/actionTypes';

export const selectTicker = ticker => ({
  type: SELECT_TICKER,
  ticker,
});

export default {
  selectTicker,
};
