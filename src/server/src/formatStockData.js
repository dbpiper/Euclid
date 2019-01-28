import * as R from 'ramda';
import moment from 'moment';
// import _ from 'lodash';

/**
 *
 * Formats the stock data by keeping only the things that we want
 * and also transforming date strings into unix timestamps
 *
 * @param {Array} stockData The stock data from IEX
 * @return {Array} The stock data after formatting has been applied
 */
module.exports = function formatStockData(stockData) {
  const dateFormat = 'YYYY-MM-DD';
  const formattedData = R.map((elem) => {
    const unixTimestamp = moment(elem.date, dateFormat).unix();
    return {
      date: unixTimestamp,
      price: elem.vwap,
      ticker: stockData.ticker,
    };
  }, stockData.data);

  return formattedData;
};
