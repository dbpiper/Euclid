import { IEXClient } from 'iex-api';
import fetch from 'isomorphic-fetch';

require('isomorphic-fetch');
/**
 *
 * Fetch stock data
 * @param {String} ticker The ticker symbol of the stock to fetch
 * @param {String} time The time range for the data, see IEX for format
 * @returns {Array} The data that was retrieved with the ticker added to each
 * element
 */
module.exports = async function fetchStock(ticker, time) {
  const iex = new IEXClient(fetch);
  const data = await iex.stockChart(ticker, time);
  return {
    ticker,
    data,
  };
};
