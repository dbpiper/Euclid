import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import ErrorBoundary from 'react-error-boundary';

import { OnTickerSelectFunction } from 'App/shared/containers/SelectTickerSearchField';
import getTickersQuery from '../queries/getTickersQuery';
import { Tickers } from '../queries/types/Tickers';
import SearchField, { ISelectElement } from './SearchField';

class TickersQuery extends Query<Tickers, void> {}

const categories: ISelectElement[] = [{ value: 'stocks', label: 'Stocks' }];

interface IGetTickersSearchFieldProps {
  onTickerSelect: OnTickerSelectFunction;
}

interface IGetTickersSearchFieldState {
  selectedSearchItem: ISelectElement | undefined;
  selectedCategory: ISelectElement | undefined;
}

class GetTickersSearchField extends React.Component<
  IGetTickersSearchFieldProps,
  IGetTickersSearchFieldState
> {
  public static propTypes: any;

  constructor(props: IGetTickersSearchFieldProps) {
    super(props);
    this.state = {
      selectedSearchItem: undefined,
      selectedCategory: undefined,
    };
  }

  public handleChangeCategory = (
    selected?: ISelectElement | ISelectElement[] | null,
  ) => {
    const selectedCategory = selected as ISelectElement;
    this.setState({ selectedCategory });
  }

  public handleChangeSearchItem = (
    selected?: ISelectElement | ISelectElement[] | null,
  ) => {
    const selectedSearchItem = selected as ISelectElement;
    const { onTickerSelect } = this.props;
    this.setState({ selectedSearchItem });
    onTickerSelect(selectedSearchItem.value);
  }

  public render() {
    const { selectedSearchItem, selectedCategory } = this.state;
    return (
      <ErrorBoundary>
        <TickersQuery query={getTickersQuery}>
          {({ loading, error, data }): JSX.Element => {
            if (loading && typeof error === 'undefined') {
              return <p>Loading...</p>;
            }
            if (error) return <p>Error :(</p>;
            const queryData = data as Tickers;
            const tickerOptions: ISelectElement[] = _.map(
              queryData.tickers,
              ticker => ({
                value: ticker,
                label: ticker,
              }),
            );
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
        </TickersQuery>
      </ErrorBoundary>
    );
  }
}

GetTickersSearchField.propTypes = {
  onTickerSelect: PropTypes.func.isRequired,
};

export default GetTickersSearchField;
