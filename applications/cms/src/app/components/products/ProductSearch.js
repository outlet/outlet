import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'rebass';
import { debounce } from 'lodash';

const DEBOUNCE_TIMER = 300;

class ProductSearch extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    instant: PropTypes.bool,
    className: PropTypes.string,
    onSearch: PropTypes.func,
    onSearchChange: PropTypes.func,
    initialQuery: PropTypes.string,
    emptyQuery: PropTypes.string
  };

  static defaultProps = {
    loading: false,
    instant: false,
    initialQuery: null,
    emptyQuery: ''
  };

  state = { query: '' };

  componentDidMount() {
    const { initialQuery } = this.props;

    if (initialQuery) {
      this.setState({ query: initialQuery });
    }
  }

  handleSearch = () => {
    const { query } = this.state;
    const { onSearch } = this.props;

    if (typeof onSearch === 'function') {
      return onSearch({ query });
    }
  };

  debouncedSearch = debounce(this.handleSearch, DEBOUNCE_TIMER);

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }

  handleSearchChange = (e, { value }) => {
    const { instant, onSearchChange, emptyQuery } = this.props;
    const query = value || emptyQuery;

    this.setState({ query });

    if (instant) this.debouncedSearch();

    if (typeof onSearchChange === 'function') {
      return onSearchChange({ query });
    }
  };

  render() {
    const { loading } = this.props;
    const { query } = this.state;

    return (
      <Input
        placeholder="Search..."
        onChange={this.handleSearchChange}
        onKeyPress={this.handleKeyPress}
        disabled={loading}
        action={{ icon: 'search', loading, onClick: this.handleSearch }}
        value={query}
      />
    );
  }
}

export default ProductSearch;
