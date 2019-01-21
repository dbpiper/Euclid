// import * as R from 'ramda';
// import moment from 'moment';
import { IEXClient } from 'iex-api';
import fetch from 'isomorphic-fetch';
// import _ from 'lodash';

require('isomorphic-fetch');
/**
 *
 * Fetch stock data
 * @param {String} ticker The ticker symbol of the stock to fetch
 * @returns {Array} The data that was retrieved with the ticker added to each
 * element
 */
module.exports = async function fetchStock(ticker) {
  const iex = new IEXClient(fetch);
  const data = await iex.stockChart(ticker, '2y');
  return {
    ticker,
    data,
  };
};
