import _ from 'lodash';
import moment from 'moment';
import { ReactText } from 'react';
import { IStock } from '../types/StockInterfaces';

import TimeWindow from '../shared/TimeWindow';

/**
 * Picks out the earliest possible date that can fit in a given time window,
 * or slice of time. This is used to query the server so that we can get
 * data-points that are within a specific range of time. For example:
 * within the last 6 months.
 *
 * @param {string} timeWindow - The range of time we are using
 * @returns {number} date - The date as a unix timestamp which is the
 * earliest possible date that fits in our time slice, based on the time window.
 */
export const getEarliestDate = (timeWindow: string): number => {
  const sixMonths = 6;
  const oneYear = 1;
  const threeYears = 3;
  const fiveYears = 5;

  switch (timeWindow) {
    case TimeWindow.AllTime:
      return 0;
    case TimeWindow.YTD:
      return moment.utc(`01/01/${moment.utc().year()}`, 'MM/DD/YYYY').unix();
    case TimeWindow.SixMonths:
      return moment
        .utc()
        .subtract(sixMonths, 'months')
        .unix();
    case TimeWindow.OneYear:
      return moment
        .utc()
        .subtract(oneYear, 'year')
        .unix();
    case TimeWindow.ThreeYears:
      return moment
        .utc()
        .subtract(threeYears, 'years')
        .unix();
    case TimeWindow.FiveYears:
      return moment
        .utc()
        .subtract(fiveYears, 'years')
        .unix();
    default:
      return 0;
  }
};

/**
 * Formats the unix timestamp as short month string. This is used
 * for when there is a large range of data to draw and we don't want
 * to clutter up the chart with tons of information/crowd the months together.
 *
 * @param {number} unixTime The date as a unix timestamp
 * @returns {string} The date formatted in a short month format
 */
const monthFormat = (unixTime: number): string => {
  const longestShortMonthName = 6;
  const month = moment
    .unix(unixTime)
    .utc()
    .format('MMMM');

  if (month.length < longestShortMonthName) {
    return month;
  }

  return moment
    .unix(unixTime)
    .utc()
    .format('MMM.');
};

/**
 * Formats the unix timestamp in a medium length format, which combines
 * month and day. The month will either be the same format as the month
 * format function, or will be its full name if it is short enough.
 *
 * This is useful for when there is a smaller range of data, but still not
 * small enough that full month names make sense to use.
 *
 * The day will not be zero-padded.
 *
 * @param {number} unixTime The date as a unix timestamp
 * @returns {string} The date formatted in a medium-length month and day format
 */
const dayMonthFormat = (unixTime: number): string => {
  const longestShortMonthName = 6;
  const month = moment
    .unix(unixTime)
    .utc()
    .format('MMMM D');

  if (month.length < longestShortMonthName) {
    return month;
  }

  return moment
    .unix(unixTime)
    .utc()
    .format('MMM. D');
};

/**
 * Formats the unix timestamp in a long format, which combines
 * month and day. The month will be the full name of the month.
 *
 * This is useful when there is a very small range of data, and
 * the other formats don't take up enough space and look odd.
 *
 * The day will not be zero-padded.
 *
 * @param {number} unixTime The date as a unix timestamp
 * @returns {string} The date formatted in a long month and day format
 */
const longDayMonthFormat = (unixTime: number): string => {
  const month = moment
    .unix(unixTime)
    .utc()
    .format('MMMM D');
  return month;
};

/**
 * Formats the unix timestamp date in an appropriate format based on how much
 * time distance there is between the date in question and the most distant
 * date that we are working with.
 *
 * @param {number} unixTime The date as a unix timestamp
 * @param {number} mostDistantDate The date that will be used to decide how long
 * of a time range we are working with here.
 * @returns {string} The date formatted appropriately based on the range of time.
 */
export const getDateFormat = (
  unixTime: number,
  mostDistantDate: number,
): string => {
  const longestLongMonthTime = 3;
  const longestMedMonthTime = 7;
  const elapsedMonths = moment
    .utc()
    .diff(moment.unix(mostDistantDate).utc(), 'months');

  if (elapsedMonths < longestLongMonthTime) {
    return longDayMonthFormat(unixTime);
  }
  if (elapsedMonths < longestMedMonthTime) {
    return dayMonthFormat(unixTime);
  }

  return monthFormat(unixTime);
};

/**
 * Gets the earliest date in a list of stocks. Which is helpful for telling
 * Recharts the minimum value of our data.
 *
 * @param {IStock[]} stocks The list of stocks to get the earliest date from
 * @returns {number} The earliest date from the list of stocks in unix time
 */
export const getFirstDateInStocks = (stocks: IStock[]): number => {
  const sortedStocks = _.sortBy(stocks, ['date']);
  const firstStock = _.first(sortedStocks);
  if (typeof firstStock === 'undefined') {
    return 0;
  }
  return firstStock.date;
};

/**
 * Converts a unix time stamp to a date string, used by the tooltip
 * formatting logic.
 *
 * @param {number} unixTime The date to convert as a unix time stamp
 * @returns {string} The date formatted as: MMMM D, YYYY
 */
// prettier-ignore
export const unixTimeToDate = (unixTime: number): string => (
  moment
    .unix(unixTime)
    .utc()
    .format('MMMM D, YYYY')
);

/**
 * This function helps with converting between ReactText objects
 * and numbers, we don't know for sure that our object is a number so
 * this function helps by converting for sure to a number.
 *
 * @param {(ReactText | ReactText[])} maybeText The data to convert, which
 * is some sort of ReactText object or array of them
 * @returns {number} The number which we got from the text
 */
export const reactTextToNumber = (
  maybeText: ReactText | ReactText[],
): number => {
  let textArray: ReactText[];
  let text: ReactText;
  let num: number;
  if (typeof maybeText !== 'string' && maybeText.hasOwnProperty('length')) {
    textArray = maybeText as ReactText[];
    text = textArray[0];
  } else {
    text = maybeText as ReactText;
  }

  if (
    (typeof maybeText === 'string' || typeof maybeText === 'object') &&
    typeof text !== 'number'
  ) {
    num = Number.parseFloat(text);
  } else {
    num = maybeText as number;
  }

  return num;
};
