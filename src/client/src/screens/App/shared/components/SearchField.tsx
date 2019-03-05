import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import textColor from 'App/shared/styles/text-color';
import { ITheme } from 'config/types/react-select';

const SearchSection = styled.section`
  margin-top: 1rem;
  display: flex;
  ${textColor}
`;

const SearchButton = styled.button`
  background-image: none;
  background-color: #262a30;
  outline: 0;
  border-color: #999999;
  box-shadow: 0;
  border-left: 0;
  border-width: 1px;

  appearance: button;
`;

const searchCategoryStyles = {
  option: (provided: any) => ({
    ...provided,
    padding: '20px',
  }),
  control: (provided: any) => ({
    ...provided,
    width: 130,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    opacity: 1,
  }),
  indicatorSeparator: () => ({
    // | separator between box and dropdown indicator
    opacity: 0,
  }),
};

const searchFieldStyles = {
  option: (provided: any) => ({
    ...provided,
    padding: '20px',
  }),
  control: (provided: any) => ({
    ...provided,
    width: 200,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    opacity: 1,
  }),
  indicatorSeparator: () => ({
    // | separator between box and dropdown indicator
    opacity: 0,
  }),
  dropdownIndicator: () => ({
    // chevron by default
    opacity: 0,
  }),
};

const customTheme = (theme: ITheme) => ({
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

export interface ISelectElement {
  value: string;
  label: string;
}

export type HandleChangeSelectFunction = (
  selected?: ISelectElement | ISelectElement[] | null,
) => void;

interface ISearchFieldProps {
  options: ISelectElement[];
  categories: ISelectElement[];
  handleChangeCategory: HandleChangeSelectFunction;
  handleChangeSearchItem: HandleChangeSelectFunction;
  selectedCategory: ISelectElement;
  selectedSearchItem: ISelectElement;
}

const SearchField = (props: ISearchFieldProps) => {
  const {
    options,
    categories,
    handleChangeCategory,
    handleChangeSearchItem,
    selectedCategory,
    selectedSearchItem,
  } = props;
  return (
    <SearchSection>
      <Select
        styles={searchCategoryStyles}
        value={selectedCategory}
        onChange={handleChangeCategory}
        options={categories}
        theme={customTheme}
        placeholder="All"
      />
      <Select
        styles={searchFieldStyles}
        value={selectedSearchItem}
        onChange={handleChangeSearchItem}
        options={options}
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
};

SearchField.defaultProps = {
  selectedCategory: null,
  selectedSearchItem: null,
};

SearchField.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  handleChangeCategory: PropTypes.func.isRequired,
  handleChangeSearchItem: PropTypes.func.isRequired,
  selectedCategory: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  selectedSearchItem: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

export default SearchField;
