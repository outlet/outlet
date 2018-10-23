import { isUserAlreadyAuthenticatedResolver } from '@schema/acl';
import { ValidationError } from '@schema/errors';
import { User } from '@models';

export default isUserAlreadyAuthenticatedResolver.createResolver(
  async (_, params) => {
    try {
      return (await User.query().insertAndFetch(params)).toJSON();
    } catch (error) {
      throw new ValidationError(error);
    }
  }
);
