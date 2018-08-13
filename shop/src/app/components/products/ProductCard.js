import React from 'react';
import PropTypes from 'prop-types';
import { Card, BackgroundImage, Subhead, Text } from 'rebass';

const ProductList = (props) => {
  const { product } = props;

  return (
    <Card>
      <BackgroundImage src={product.imageUrl} />
      <Subhead>{product.name}</Subhead>
      <Text>{product.description}</Text>
    </Card>
  );
};

ProductList.propTypes = {
  product: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default ProductList;
