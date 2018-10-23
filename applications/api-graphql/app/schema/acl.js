import { baseResolver } from '@schema/Base';
import {
  AuthenticatedError,
  UnauthorizedError,
  ForbiddenError
} from '@schema/errors';

// Throws an error if the user is not authenticated
export const isUserAuthenticatedResolver = baseResolver.createResolver(
  (root, args, { user }) => {
    if (!user) {
      throw new UnauthorizedError();
    }
  }
);

// Throws an error is the user is already authenticated
export const isUserAlreadyAuthenticatedResolver = baseResolver.createResolver(
  (root, args, { user }) => {
    if (user) {
      throw new AuthenticatedError();
    }
  }
);

// Throws an error if the user is not an admin. Must also be authenticated.
export const isAdminResolver = isUserAuthenticatedResolver.createResolver(
  (root, args, { user }) => {
    if (!user.isAdmin()) {
      throw new ForbiddenError();
    }
  }
);

export default {
  isUserAuthenticatedResolver,
  isUserAlreadyAuthenticatedResolver,
  isAdminResolver
};
