import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '@components/form';
import { Input as RebassInput } from 'rebass';

const Input = (props) => {
  const { field, form, ...rest } = props;
  const { touched, errors } = form;
  const hasError = !!(touched[field.name] && errors[field.name]);
  const addProps = {};

  if (hasError) {
    addProps.boxShadow = 'inset 0 0 0 1px red';
    addProps.color = 'red';
  }

  return (
    <Field
      label={props.label || props.placeholder}
      error={hasError && errors[field.name]}
      render={() => (
        <RebassInput
          {...field}
          {...rest}
          {...addProps}
        />
      )}
    >
    </Field>
  );
};

Input.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

export default Input;
