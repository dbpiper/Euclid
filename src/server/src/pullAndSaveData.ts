import async from 'async';

import { prisma, StockCreateInput } from '../generated/prisma-client';

import fetchStock from './fetchStock';
import formatStockData from './formatStockData';

/**
 * Add each of the stocks pulled from IEX to the DB
 *
 * @param data - The IEX stock data
 */
const addEach = (data: any[]): Promise<any> => {
  const addLimit = 50;
  return (
    new Promise((resolve, reject) => {
      async.eachLimit(data, addLimit, async (datum: StockCreateInput, callback) => {
        try {
          await prisma.createStock(datum);
          callback(); // signal that we're done
        } catch (error) {
          callback(error);
        }
      }, error => (
        reject(error)
      ));
      resolve();
    })
  );
};

/**
 *
 * Takes a ticker and pulls all the information possible (5 years)
 * from IEX for that ticker, storing the information in the DB.
 *
 * @param ticker - The ticker of the stock to pull data for
 */
module.exports = async function pullAndSaveData(ticker: string): Promise<any> {
  const data = await fetchStock(ticker, '5y');
  const formattedData = formatStockData(data);

  return addEach(formattedData);
};
