export interface IRawStockData {
  date: string;
  vwap: number;
}

export interface IStockData {
  ticker: string;
  data: IRawStockData[];
}

export interface IFormattedStockData {
  date: number;
  price: number;
  ticker: string;
}
