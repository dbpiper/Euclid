import * as R from 'ramda';
import moment from 'moment';

import { prisma } from '../generated/prisma-client';

import fetchStock from './fetchStock';
import formatStockData from './formatStockData';

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
  await prisma
    .createStockList({
      ticker: formattedData.ticker,
      stocks: {
        create: formattedData.data,
      },
    });
};
