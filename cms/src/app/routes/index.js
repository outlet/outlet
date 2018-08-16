import Error from '@pages/Error';
import Home from '@pages/Home';
import Products from '@pages/Products';
import { NewProductPage, EditProductPage } from '@pages/Product';

export default [
  { path: '/admin', exact: true, component: Home },
  { path: '/admin/products', exact: true, component: Products },
  { path: '/admin/products/new', exact: true, component: NewProductPage },
  { path: '/admin/products/:slug', exact: true, component: EditProductPage },
  { path: '/admin/*', component: Error }
];
