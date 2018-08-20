import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'rebass';
import { Field, FieldArray } from 'formik';
import { InputField } from '@components/form';
import { validOptions } from '@helpers/variants';

class VariantEditor extends Component {
  static propTypes = {
    options: PropTypes.array,
    variants: PropTypes.array
  };

  static defaultProps = {
    options: [],
    variants: []
  };

  render() {
    const { options, variants } = this.props;
    const headerOptions = options.filter(validOptions);

    if (!variants.length) return null;

    return (
      <FieldArray
        name="variants"
        render={() => (
          <Fragment>
            <p>Modify each variant as needed:</p>
            <table>
              <thead>
                <tr>
                  <th collapsing>
                    <Checkbox />
                  </th>
                  {headerOptions.map((option, idx) => (
                    <th collapsing key={idx}>
                      {option.name}
                    </th>
                  ))}
                  <th>Price</th>
                  <th>SKU</th>
                  <th>Barcode</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        <Checkbox />
                      </td>
                      {Object.keys(variant.options).map((key, index) => {
                        const optionName = variant.options[key];
                        return (
                          <td key={`${idx}-${index}-${optionName}`}>
                            {optionName}
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
                      <td>
                        <Field
                          component={InputField}
                          name={`variants.${idx}.barcode`}
                          placeholder="Barcode"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Fragment>
        )}
      />
    );
  }
}

export default VariantEditor;
