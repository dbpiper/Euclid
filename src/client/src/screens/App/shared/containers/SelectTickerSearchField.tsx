import { selectTicker } from 'App/shared/actions/tickers';
import { connect } from 'react-redux';
import GetTickersSearchField from '../components/GetTickersSearchField';

export type OnTickerSelectFunction = (ticker: string) => void;

const mapDispatchToProps = (dispatch: any) => ({
  onTickerSelect: (ticker: string) => (
    // disabling because the react-redux types are broken
    // tslint:disable-next-line no-unsafe-any
    dispatch(selectTicker(ticker))
  ),
});

// disabling because the react-redux types are broken
// tslint:disable-next-line no-unsafe-any
const SelectTickerSearchField = connect(
  null,
  mapDispatchToProps,
)(GetTickersSearchField);

export default SelectTickerSearchField;
