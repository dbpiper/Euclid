import fetchMock from 'fetch-mock';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { IRawStockData } from '../../types';

const readFile = promisify(fs.readFile);

let aaplData: IRawStockData[];
let aaplDataJson: string;

/**
 * Reads the local 5y AAPL data from our local cache
 * as JSON and converts it to a native JavaScript object.
 *
 * @return The AAPL stock data from our local cache
 */
const get5yAaplJson = async (): Promise<string> => {
  if (typeof aaplDataJson === 'undefined') {
    aaplDataJson = await readFile(
      path.join(__dirname, '../mockData/5y.json'),
      'utf8',
    );
  }

  return aaplDataJson;
};

/**
 * Gets the local 5y AAPL. Reads the local file if needed or
 * from a variable if it can.
 */
const get5yAapl = async (): Promise<IRawStockData[]> => {
  if (typeof aaplData === 'undefined') {
    aaplData = JSON.parse(await get5yAaplJson()) as IRawStockData[];
  }

  return aaplData;
};

/**
 * Mocks the IEX API AAPL endpoint to return our local copy of the data
 * from a cached version of its data. This allows us to have a testable
 * version, as the data will change daily from the API itself, and require
 * a slow and brittle network request.
 *
 */
const mockIEX = async () => {
  const fiveYearAaplJson = await get5yAaplJson();

  // there is a bug in the `iex-api` code that adds an extra '/' after '1.0'
  fetchMock.get('https://api.iextrading.com/1.0//stock/AAPL/chart/5y', {
    body: fiveYearAaplJson,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export { mockIEX, get5yAapl };

export default mockIEX;
