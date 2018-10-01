import { Product } from '@models';
import { isAdminResolver } from '@schema/acl';
import createConnection from '@lib/createConnection';

export default isAdminResolver.createResolver(function (root, args) {
  return createConnection({
    args,
    model: Product,
    alphaOrderColumns: ['name'],
    fuzzyMatchColumns: ['name']
  });
});

// export default async function findProducts(root, args) {
//   const { after = null, count = 15, query: search } = args;
//
//   let query = Product.query()
//     .select(raw('*, count(*) OVER() AS fullCount'))
//     .limit(count)
//     .orderBy('createdAt', 'desc');
//
//   if (search && search !== '') {
//     query.where(
//       raw('LOWER(products.name)'),
//       'LIKE',
//       `%${search.toLowerCase()}%`
//     );
//   }
//
//   if (after) {
//     query.where('createdAt', '>', moment(after).format());
//   }
//
//   const products = await query;
//
//   return {
//     products: products.map(p => p.toJSON()),
//     meta: {
//       total: (() => {
//         const p = first(products);
//         return (p && parseInt(p.fullcount)) || 0;
//       })(),
//       after: (() => {
//         const p = last(products);
//         return p && moment(p.createdAt).unix();
//       })(),
//       count,
//       query: search || null
//     }
//   };
// }
