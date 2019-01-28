import async from 'async';

import { prisma } from '../generated/prisma-client';

import fetchStock from './fetchStock';
import formatStockData from './formatStockData';

const addEach = data => (
  new Promise(resolve => (
    async.eachLimit(data, 50, async (datum, callback) => {
      const newData = {
        date: datum.date,
        price: datum.price,
        ticker: datum.ticker,
      };
      await prisma.createStock(newData);
      callback(); // signal that we're done
    }, (error) => {
      if (error) {
        console.error(error);
      }
      resolve();
    })
  ))
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
