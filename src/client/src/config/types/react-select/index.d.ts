export interface IThemeSpacing {
  baseUnit: number;
  controlHeight: number;
  menuGutter: number;
}

export interface ITheme {
  borderRadius: number;
  colors: { [key: string]: string};
  spacing: IThemeSpacing;
}
