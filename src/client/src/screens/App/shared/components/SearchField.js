import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import _ from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const SearchSection = styled.section`
  margin-top: 1rem;
  display: flex;
`;

const SearchButton = styled.button`
  /* border: none; */
  background-image: none;
  background-color: #262a30;
  outline: 0;
  border-color: #999999;
  box-shadow: 0;
  border-left: 0;
  border-width: 1px;

  appearance: button,
`;

const searchCategoryStyles = {
  option: provided => ({
    ...provided,
    padding: '20px',
  }),
  control: provided => ({
    ...provided,
    width: 130,
  }),
  singleValue: provided => ({
    ...provided,
    opacity: 1,
  }),
  indicatorSeparator: () => ({
    // | separator between box and dropdown indicator
    opacity: 0,
  }),
};

const searchFieldStyles = {
  option: provided => ({
    ...provided,
    padding: '20px',
  }),
  control: provided => ({
    ...provided,
    width: 200,
  }),
  singleValue: provided => ({
    ...provided,
    opacity: 1,
  }),
  indicatorSeparator: () => ({
    // | separator between box and dropdown indicator
    opacity: 0,
  }),
  dropdownIndicator: () => ({ // chevron by default
    opacity: 0,
  }),
};

const customTheme = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: '#262a30', // highlight color
    neutral0: '#18181a', // background color
    neutral80: '#c0beb', // chevron hover color
    neutral20: '#999999', // border color
    neutral50: '#c0bebb', // text color

    // neutral30: 'green', // hover border color
  },
});

const categories = [
  { value: 'stocks', label: 'Stocks' },
];

class SearchField extends React.Component {
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
      <Query
        query={gql`
          query {
            tickers
          }
        `}
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
            <SearchSection>
              <Select
                styles={searchCategoryStyles}
                value={selectedCategory}
                onChange={this.handleChangeCategory}
                options={categories}
                theme={customTheme}
                placeholder="All"
              />
              <Select
                styles={searchFieldStyles}
                value={selectedSearchItem}
                onChange={this.handleChangeSearchItem}
                options={tickerOptions}
                theme={customTheme}
                placeholder="Search"
              />

              <SearchButton type="button">
                <span role="img" aria-label="Search">
                  🔍
                </span>
              </SearchButton>

            </SearchSection>

          );
        }}
      </Query>
    );
  }
}

SearchField.propTypes = {
  onTickerSelect: PropTypes.func.isRequired,
};

export default SearchField;
