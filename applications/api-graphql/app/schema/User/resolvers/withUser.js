import { User } from '@models';
import { NotFoundError } from '@schema/errors';
import { baseResolver } from '@schema/Base';

export default baseResolver.createResolver(async (_, args, context) => {
  const { id, email } = args;

  if (!id && !email) {
    throw new NotFoundError();
  }

  let user = await User.query()
    .modify(query => {
      ['id', 'email'].forEach(col => {
        if (args[col]) query.where(col, args[col]);
      });
    })
    .first();

  if (!user) {
    throw new NotFoundError();
  }

  context.userResource = user;
});
