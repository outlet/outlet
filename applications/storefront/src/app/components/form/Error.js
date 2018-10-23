import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'rebass';

const Error = props => {
  const { message, children } = props;

  return (
    <Message bg="transparent" color="red">
      {children || message}
    </Message>
  );
};

Error.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any
};

export default Error;
