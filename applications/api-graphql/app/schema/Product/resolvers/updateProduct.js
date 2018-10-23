import { isAdminResolver } from '@schema/acl';
import { Product } from '@models';

export default isAdminResolver.createResolver(
  async (_, args) => {
    let updatedProduct = await Product.query().upsertGraphAndFetch(args);

    return updatedProduct.toJSON();
  }
);
