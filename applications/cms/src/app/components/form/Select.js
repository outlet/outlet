import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '@components/form';
import { Select as RebassSelect } from 'rebass';

const Select = props => {
  const { field, form, options, label, ...rest } = props;
  const { touched, errors } = form;
  const hasError = !!(touched[field.name] && errors[field.name]);

  return (
    <Field
      label={label}
      error={hasError && errors[field.name]}
      render={() => {
        <RebassSelect {...field} {...rest}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </RebassSelect>;
      }}
    />
  );
};

Select.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  options: PropTypes.array
};

Select.defaultProps = {
  options: []
};

export default Select;
