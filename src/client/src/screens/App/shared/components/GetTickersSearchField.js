import React from 'react';
import _ from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import ErrorBoundary from 'react-error-boundary';
import SearchField from './SearchField';

const categories = [
  { value: 'stocks', label: 'Stocks' },
];

export const GET_TICKERS_QUERY = gql`
  query {
    tickers
  }
`;

class GetTickersSearchField extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSearchItem: null,
      selectedCategory: null,
    };
  }

  handleChangeCategory = (selectedCategory) => {
    this.setState({ selectedCategory });
  };

  handleChangeSearchItem = (selectedSearchItem) => {
    const { onTickerSelect } = this.props;
    this.setState({ selectedSearchItem });
    onTickerSelect(selectedSearchItem.value);
  };

  render() {
    const { selectedSearchItem, selectedCategory } = this.state;
    return (
      <ErrorBoundary>
        <Query
          query={GET_TICKERS_QUERY}
        >
          {({
            loading,
            error,
            data,
          }) => {
            if (loading && error === false) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const tickerOptions = _.map(data.tickers, ticker => (
              { value: ticker, label: ticker }
            ));
            return (
              <ErrorBoundary>
                <SearchField
                  options={tickerOptions}
                  categories={categories}
                  handleChangeCategory={this.handleChangeCategory}
                  handleChangeSearchItem={this.handleChangeSearchItem}
                  selectedCategory={selectedCategory}
                  selectedSearchItem={selectedSearchItem}
                />
              </ErrorBoundary>
            );
          }}
        </Query>
      </ErrorBoundary>
    );
  }
}

GetTickersSearchField.propTypes = {
  onTickerSelect: PropTypes.func.isRequired,
};

export default GetTickersSearchField;
