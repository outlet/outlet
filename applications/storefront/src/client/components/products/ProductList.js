import React from 'react';
import PropTypes from 'prop-types';
import { ProductCard } from '@components/products';

const ProductList = props => {
  const { products, loading } = props;

  return (
    <div>
      {products.map(product => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string
};

ProductList.defaultProps = {
  products: [],
  loading: false
};

export default ProductList;
