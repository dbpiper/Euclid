import { combineReducers } from 'redux';
import { ITickersReducerState, tickers } from './shared/reducers/tickers';

export interface IRootReducerState {
  tickers: ITickersReducerState;
}

export const rootReducer = combineReducers({
  tickers,
});
