import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'rebass';
import { Field } from 'formik';
import { Input, InputField } from '@components/form';
import { first, map } from 'lodash';

class VariantList extends Component {
  static propTypes = {
    variants: PropTypes.array
  };

  static defaultProps = {
    variants: []
  };

  render() {
    const { variants } = this.props;
    const options = Object.keys(first(variants).options);

    return (
      <table>
        <thead>
          <tr>
            <th collapsing>
              <Checkbox />
            </th>
            {options.map((opt, idx) => (
              <th key={idx}>{opt}</th>
            ))}
            <th>Price</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, idx) => {
            return (
              <tr className={css.variant} key={idx}>
                <td className={css.checkbox}>
                  <Checkbox />
                </td>
                {options.map((name, index) => {
                  return (
                    <td key={`${idx}-${index}`}>
                      <Field
                        component={InputField}
                        name={`variants[${idx}].options[${name}]`}
                        className={css.optionField}
                        placeholder={name}
                      />
                    </td>
                  );
                })}
                <td>
                  <Field
                    component={InputField}
                    name={`variants.${idx}.priceInCents`}
                    placeholder="Price"
                    type="number"
                  />
                </td>
                <td>
                  <Field
                    component={InputField}
                    name={`variants.${idx}.sku`}
                    placeholder="SKU"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default VariantList;
