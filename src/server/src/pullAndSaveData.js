import async from 'async';

import { prisma } from '../generated/prisma-client';

import fetchStock from './fetchStock';
import formatStockData from './formatStockData';

const addEach = data => (
  new Promise((resolve, reject) => {
    async.eachLimit(data, 50, async (datum, callback) => {
      try {
        await prisma.createStock(datum);
        callback(); // signal that we're done
      } catch (err) {
        callback(err);
      }
    }, error => (
      reject(error)
    ));
    resolve();
  })
);

/**
 *
 * Takes a ticker and pulls all the information possible (5 years)
 * from IEX for that ticker, storing the information in the DB.
 *
 * @param {String} ticker The ticker of the stock to pull data for
 */
module.exports = async function pullAndSaveData(ticker) {
  const data = await fetchStock(ticker, '5y');
  const formattedData = formatStockData(data);

  return addEach(formattedData);
};
