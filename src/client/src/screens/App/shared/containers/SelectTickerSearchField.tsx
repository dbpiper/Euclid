import { selectTicker } from 'App/shared/actions/tickers';
import { connect } from 'react-redux';
import GetTickersSearchField from '../components/GetTickersSearchField';

const mapDispatchToProps = (dispatch: any) => ({
  onTickerSelect: (ticker: string) => (
    dispatch(selectTicker(ticker))
  ),
});

const SelectTickerSearchField = connect(
  null,
  mapDispatchToProps,
)(GetTickersSearchField);

export default SelectTickerSearchField;
