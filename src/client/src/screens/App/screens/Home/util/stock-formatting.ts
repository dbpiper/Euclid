import _ from 'lodash';
import memoizeOne from 'memoize-one';
import * as R from 'ramda';

import { IStock, ITickerData } from '../types/StockInterfaces';

/**
 * This function gets the ticker associated with a stock array.
 * It assumes that all of the stocks in the array have the same
 * ticker! If this is not true, than it will give incorrect results.
 * It always gets the ticker of the first stock (for speed reasons),
 * since this is an O(1) operation.
 *
 * @param {IStock[]} stocks The stock array to get the ticker from
 * @returns {string} ticker The ticker of the stock array
 */
const getTickerFromStocks = memoizeOne(
  (stocks: IStock[]): string => {
    let first = _.first(stocks);
    if (typeof first === 'undefined') {
      if (stocks.length > 0) {
        first = stocks[0];
      }

      return '';
    }
    return first.ticker;
  },
);

/**
 * Converts a vanilla stocks object array to a special stocks array that
 * has the date from the old object, but where there is a special property/key
 * on the object which is the value of the old tickers property on the old
 * object. The value for this new property is the price from the old object.
 *
 * This is done so that it can be used by Recharts, as it requires that the
 * data be in this format.
 *
 * @param {IStock[]} stocks The stocks data to convert
 * @returns {ITickerData[]} The Recharts formatted data that was converted
 */
// prettier-ignore
const convertStocksToKeyedStocks = memoizeOne((stocks: IStock[]): ITickerData[] => {
  if (stocks && stocks.length > 0) {
    // prettier-ignore
    return R.map((stockElem) => {
      const tickerObj: ITickerData = {
        date: stockElem.date,
      };

      // make mapping from ticker to price for Recharts to draw
      tickerObj[stockElem.ticker] = stockElem.price;
      return tickerObj;
    }, stocks);
  }

  return [] as ITickerData[];
});

export { getTickerFromStocks, convertStocksToKeyedStocks };
