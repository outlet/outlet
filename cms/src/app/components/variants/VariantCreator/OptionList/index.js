import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'rebass';
import { Creatable } from 'react-select';
import { getVariantOptions } from '@helpers/variants';
import { get } from 'lodash';
import dayjs from 'dayjs';

class OptionsList extends Component {
  static propTypes = {
    form: PropTypes.object,
    onChange: PropTypes.func
  };

  state = {
    options: [
      { id: dayjs().valueOf(), name: 'Size', values: [] }
    ]
  };

  // Updates the generate variants based on the option types.
  updateVariants = () => {
    const { onChange } = this.props;

    // Wrap in a timeout so this isn't executed until state is updated
    // TODO: Try to do something better here.
    setTimeout(() => {
      const { form } = this.props;
      const { options } = this.state;
      const variantOptions = getVariantOptions(options);
      const variants = variantOptions.map((options, idx) => {
        let variant = get(form, `values.variants[${idx}]`, {});

        return {
          priceInCents: 0,
          sku: '',
          barcode: '',
          ...variant,
          options
        };
      });

      form.setFieldValue('variants', variants);

      // TODO: We can do better here, maybe on componentDidUpdate?
      if (typeof onChange === 'function') {
        return onChange(options);
      }
    });
  };

  handleAddOption = () => {
    this.setState({
      options: [
        ...this.state.options,
        { id: dayjs().valueOf(), name: '', values: [] }
      ]
    });

    this.updateVariants();
  };

  handleRemoveOption = id => {
    return () => {
      this.setState({
        options: this.state.options.filter(option => option.id !== id)
      });

      this.updateVariants();
    };
  };

  // Custom handler for react select component
  handleAddOptionValue = id => {
    return data => {
      const { options } = this.state;
      const values = data.map(v => v.value);

      this.setState({
        options: options.map(option => {
          if (option.id === id) {
            return { ...option, values };
          }

          return option;
        })
      });

      this.updateVariants();
    };
  };

  handleChangeOptionName = id => {
    return (e, { value }) => {
      this.setState({
        options: this.state.options.map(option => {
          if (option.id === id) {
            return { ...option, name: value };
          }
          return option;
        })
      });

      this.updateVariants();
    };
  };

  render() {
    const { options } = this.state;

    return (
      <table>
        <thead>
          <tr>
            <th>Option name</th>
            <th>Option values</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {options.map((option, idx) => {
            const { id, name } = option;

            return (
              <tr key={idx}>
                <td collapsing>
                  <Input
                    placeholder="Option Name"
                    onChange={this.handleChangeOptionName(id)}
                    value={name}
                  />
                </td>
                <td>
                  <Creatable
                    isMulti
                    onChange={this.handleAddOptionValue(id)}
                    placeholder="Add separate option values..."
                    selected
                  />
                </td>
                <td>
                  <Button
                    type="button"
                    onClick={this.handleRemoveOption(id)}
                    children={'Delete'}
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={3}>
              <Button
                onClick={this.handleAddOption}
                type="button"
                content="Add another option"
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default OptionsList;
