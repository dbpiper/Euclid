// tslint:disable no-magic-numbers

import R from 'ramda';
import { prisma } from '../../generated/prisma-client';
import fetchStock from '../fetchStock';
import formatStockData from '../formatStockData';
import { addEach, batchSize, pullAndSaveData } from '../pullAndSaveData';
import { IFormattedStockData } from '../types';
import { mockIEX } from './utils/mockIEX';

let error = false;
const errorMessage = 'error creating stock!';

jest.mock('../../generated/prisma-client', () => {
  const mockedModule = jest.genMockFromModule('../../generated/prisma-client');

  const createStock = (_stock: IFormattedStockData) => {
    return new Promise(async (resolve, reject) => {
      if (error) {
        reject(errorMessage);
      }
      resolve('success');
    });
  };

  const mockedPrisma = {
    createStock,
  };

  return {
    ...mockedModule,
    prisma: mockedPrisma,
  };
});

beforeAll(async () => {
  await mockIEX();
});

describe('addEach', () => {
  let createStockSpy: jest.SpyInstance;
  jest.setTimeout(10 * 1000);

  beforeAll(() => {
    createStockSpy = jest.spyOn(prisma, 'createStock');
  });

  // reset error automatically so that we don't have to manually do so
  afterEach(() => {
    error = false;
  });

  test('addEach with one item', async () => {
    expect.assertions(1);

    await addEach([
      {
        date: 1391731200,
        price: 68.8015,
        ticker: 'AAPL',
      },
    ]);

    expect(createStockSpy.mock.calls).toEqual([
      [
        {
          date: 1391731200,
          price: 68.8015,
          ticker: 'AAPL',
        },
      ],
    ]);
  });

  test('addEach with one item with error', async () => {
    expect.assertions(2);

    error = true;

    try {
      await addEach([
        {
          date: 1391731200,
          price: 68.8015,
          ticker: 'AAPL',
        },
      ]);
    } catch (err) {
      expect(err).toEqual(new Error(errorMessage));
    }

    expect(createStockSpy.mock.calls).toEqual([
      [
        {
          date: 1391731200,
          price: 68.8015,
          ticker: 'AAPL',
        },
      ],
    ]);
  });
});

describe('pullAndSaveData integration test', () => {
  let createStockSpy: jest.SpyInstance;
  jest.setTimeout(10 * 1000);

  beforeEach(() => {
    createStockSpy = jest.spyOn(prisma, 'createStock');
  });

  // reset error automatically so that we don't have to manually do so
  afterEach(() => {
    error = false;
  });

  test('run with 5y AAPL', async () => {
    expect.assertions(1);

    await pullAndSaveData('AAPL');

    const rawAapl = await fetchStock('AAPL', '5y');
    const formattedAapl = formatStockData(rawAapl);
    // prettier-ignore
    const expectedResults = R.map(stock => [stock], formattedAapl);
    expect(createStockSpy.mock.calls).toEqual(expectedResults);
  });

  test('run with 5y AAPL with an error', async () => {
    expect.assertions(2);

    error = true;
    try {
      await pullAndSaveData('AAPL');
    } catch (err) {
      expect(err).toEqual(new Error(errorMessage));
    }

    const rawAapl = await fetchStock('AAPL', '5y');
    const formattedAapl = formatStockData(rawAapl);

    // we are only expecting the call to happen once since it will
    // throw an error/reject and exit after the first time
    const firstBatchOfStocks = R.take(batchSize, formattedAapl);
    // prettier-ignore
    const expectedResults = R.map(stock => [stock], firstBatchOfStocks);

    expect(createStockSpy.mock.calls).toEqual(expectedResults);
  });
});
