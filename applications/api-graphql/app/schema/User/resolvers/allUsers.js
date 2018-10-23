import { User } from '@models';
import { isAdminResolver } from '@schema/acl';
import createConnection from '@lib/createConnection';

export default isAdminResolver.createResolver(function (root, args) {
  return createConnection({
    args,
    model: User,
    alphaOrderColumns: ['firstName', 'lastName', 'email'],
    fuzzyMatchColumns: ['firstName', 'lastName', 'email']
  });
});
