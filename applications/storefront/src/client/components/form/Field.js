import React from 'react';
import PropTypes from 'prop-types';
import { Error, Input } from '@components/form';
import { Box, Label } from 'rebass';

const Field = (props) => {
  const { render, error, label, ...rest } = props;

  return (
    <Box>
      {label && <Label>{label}</Label>}
      {render(rest)}
      {error && <Error message={error} />}
    </Box>
  );
};

Field.propTypes = {
  render: PropTypes.func,
  label: PropTypes.string,
  error: PropTypes.string
};

Field.defaultProps = {
  component: Input,
  render: () => {}
};

export default Field;
