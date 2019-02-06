import { combineReducers } from 'redux';
import { tickers } from './shared/reducers/tickers';

export default combineReducers({
  tickers,
});
