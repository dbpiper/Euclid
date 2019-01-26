import React from 'react';
import Select from 'react-select';


const customStyles = {
  option: provided => ({
    ...provided,
    // borderBottom: '20px dotted pink',
    // color: state.isSelected ? 'red' : 'blue',
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
};

const customTheme = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: '#262a30', // background color
    neutral0: '#18181a', // highlight color
    neutral80: '#c0beb', // chevron hover color
    neutral20: '#5d5d5d', // border color
    neutral50: '#c0bebb', // text color

    // neutral30: 'green', // hover border color
  },
});

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

class SearchField extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedOption: null,
    };
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected: ${selectedOption}`);
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        styles={customStyles}
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        theme={customTheme}
      />
    );
  }
}

export default SearchField;
