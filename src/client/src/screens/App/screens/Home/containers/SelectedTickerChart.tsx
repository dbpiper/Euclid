import { connect } from 'react-redux';

import Chart from '../components/Chart';

const mapStateToProps = (state: any) => ({
  selectedTicker: state.tickers.ticker,
});

export default connect(
  mapStateToProps,
)(Chart);
