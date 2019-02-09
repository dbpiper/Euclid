import { IEXClient } from 'iex-api';
// tslint:disable-next-line: no-var-requires
require('isomorphic-fetch');

import { IRawStockData, IStockData } from './types';

/**
 *
 * Fetch stock data
 * @param {string} ticker The ticker symbol of the stock to fetch
 * @param {string} time The time range for the data, see IEX for format
 * @returns {Object} The data that was retrieved with the ticker added to each
 * element
 */
const fetchStock = async (
  ticker: string,
  time: string,
): Promise<IStockData> => {
  const iex = new IEXClient(fetch);
  const data = (await iex.stockChart(ticker, time)) as IRawStockData[];
  return {
    ticker,
    data,
  };
};

export default fetchStock;
