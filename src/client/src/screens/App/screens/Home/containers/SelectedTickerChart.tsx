import { connect } from 'react-redux';

import { IRootReducerState } from 'App/reducer';
import Chart from '../components/Chart';

const mapStateToProps = (state: IRootReducerState) => ({
  selectedTicker: state.tickers.ticker,
});

export default connect(mapStateToProps)(Chart);
