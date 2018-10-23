import { isUserAlreadyAuthenticatedResolver } from '@schema/acl';
import { ValidationError } from '@schema/errors';
import { User } from '@models';
import cookieParams from '@config/cookies';

export default isUserAlreadyAuthenticatedResolver.createResolver(
  async (_, { email, password }, { res }) => {
    const user = await User.query().where('email', email).first();

    if (!user) {
      throw new ValidationError({
        data: {
          email: [{ message: global.__('errors.auth.email') }]
        }
      });
    }

    const validPassword = await user.verifyPassword(password);

    if (!validPassword) {
      throw new ValidationError({
        data: {
          password: [{ message: global.__('errors.auth.password') }]
        }
      });
    }

    const token = user.generateJWT();

    // set cookie
    console.log('setting cookie:', token, cookieParams);
    res.cookie('jwt.user', token, cookieParams);

    return {
      token,
      currentUser: user.toJSON()
    };
  }
);
