import moment from 'moment';
import R from 'ramda';
import { IFormattedStockData, IStockData } from './types';

/**
 *
 * Formats the stock data by keeping only the things that we want
 * and also transforming date strings into unix timestamps
 *
 * @param {Object} stockData The stock data from IEX
 * @return {Array} The stock data after formatting has been applied
 */
const formatStockData = (stockData: IStockData): IFormattedStockData[] => {
  const dateFormat = 'YYYY-MM-DD';
  const formattedData = R.map((elem) => {
    const unixTimestamp = moment(elem.date, dateFormat).unix();
    return {
      date: unixTimestamp,
      price: elem.vwap as number,
      ticker: stockData.ticker,
    };
  }, stockData.data);

  return formattedData;
};

export default formatStockData;
