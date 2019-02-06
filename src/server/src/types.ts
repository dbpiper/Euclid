export interface IStockData {
  ticker: string;
  data: any[];
}

export interface IFormattedStockData {
  date: number;
  price: number;
  ticker: string;
}
