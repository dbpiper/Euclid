import { connect } from 'react-redux';
import { selectTicker } from 'App/shared/actions/tickers';
import GetTickersSearchField from '../components/GetTickersSearchField';

const mapDispatchToProps = dispatch => ({
  onTickerSelect: ticker => (
    dispatch(selectTicker(ticker))
  ),
});

const SelectTickerSearchField = connect(
  null,
  mapDispatchToProps,
)(GetTickersSearchField);

export default SelectTickerSearchField;
