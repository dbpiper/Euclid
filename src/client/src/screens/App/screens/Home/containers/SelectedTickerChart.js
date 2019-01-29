import { connect } from 'react-redux';

import Chart from '../components/Chart';

const mapStateToProps = (state) => {
  console.log(state.tickers);
  return {
    selectedTicker: state.tickers.ticker,
  };
};

export default connect(
  mapStateToProps,
)(Chart);
