/**
 * The type of the Recharts data
 */
export interface ITickerData {
  /**
   * The special ticker field that maps to price information.
   * @type {number}
   * @memberof {ITickerData}
   */
  [key: string]: number;
  /**
   * The date for the price of the stock.
   *
   * @type {number}
   * @memberof ITickerData
   */
  date: number;
}

/**
 * The type of the query that returns with stock data,
 * from the GraphQL server.
 */
export interface IStockQueryData {
  /**
   * The stock array that has the stock information we wanted from the query.
   *
   * @type {IStock[]}
   * @memberof IStockQueryData
   */
  stocks: IStock[];
}

/**
 * The type of the Stock elements, which we got from the server.
 */
export interface IStock {
  /**
   * The date on which the data-point is from.
   *
   * @type {number}
   * @memberof IStock
   */
  date: number;
  /**
   * The ticker of the stock, which is a small abbreviation of its name.
   *
   * @type {string}
   * @memberof IStock
   */
  ticker: string;
  /**
   * The price of the stock on the associated date, for the associated ticker.
   *
   * @type {number}
   * @memberof IStock
   */
  price: number;
}
