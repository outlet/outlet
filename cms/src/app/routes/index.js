import Error from '@pages/Error';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Products from '@pages/Products';
import { NewProductPage, EditProductPage } from '@pages/Product';

export default [
  { path: '/', exact: true, component: Home },
  { path: '/login', exact: true, component: Login },

  { path: '/products', exact: true, component: Products },
  { path: '/products/new', exact: true, component: NewProductPage },
  { path: '/products/:slug', exact: true, component: EditProductPage },

  { path: '/*', component: Error }
];
