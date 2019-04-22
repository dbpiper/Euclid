import async from 'async';

import { prisma, StockCreateInput } from '../generated/prisma-client';

import fetchStock from './fetchStock';
import formatStockData from './formatStockData';
import { IFormattedStockData } from './types';

/**
 * The number of stocks to add to the DB in one batch,
 * this is limited to avoid crashing the DB with tons of
 * simultaneous requests.
 */
const batchSize: number = 15;

/**
 * Add each of the stocks pulled from IEX to the DB
 *
 * @param data - The IEX stock data
 */
// prettier-ignore
const addEach = (data: IFormattedStockData[]): Promise<any> => (
  new Promise((resolve, reject) => {
    async.eachLimit(
      data,
      batchSize,
      async.asyncify(async (datum: StockCreateInput) =>
        prisma.createStock(datum),
      ),
      (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      },
    );
  })
);

/**
 *
 * Takes a ticker and pulls all the information possible (5 years)
 * from IEX for that ticker, storing the information in the DB.
 *
 * @param ticker - The ticker of the stock to pull data for
 */
export default async function pullAndSaveData(ticker: string): Promise<any> {
  const data = await fetchStock(ticker, '5y');
  const formattedData = formatStockData(data);

  return addEach(formattedData);
}

export { addEach, batchSize, pullAndSaveData };
