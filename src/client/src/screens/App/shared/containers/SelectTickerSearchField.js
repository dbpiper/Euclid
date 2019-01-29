import { connect } from 'react-redux';

import { selectTicker } from 'App/shared/actions/tickers';
import SearchField from '../components/SearchField';

const mapDispatchToProps = dispatch => ({
  onTickerSelect: ticker => (
    dispatch(selectTicker(ticker))
  ),
});

const SelectTickerSearchField = connect(
  null,
  mapDispatchToProps,
)(SearchField);

export default SelectTickerSearchField;
