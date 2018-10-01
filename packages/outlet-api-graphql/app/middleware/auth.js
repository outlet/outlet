import jwt from 'express-jwt';
import express from 'express';
import { User } from '@models';

const authMiddleware = express();
const getToken = cookieName => {
  return req => {
    // Extract from cookie
    if (req.cookies && req.cookies[cookieName]) {
      return req.cookies[cookieName];
    }

    // Extract from headers
    if (req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(' ');

      if (type === 'Bearer') {
        return token;
      }
    }

    // Extract from query string
    if (req.query && req.query.token) {
      return req.query.token;
    }

    return null;
  };
};

authMiddleware.use(
  jwt({
    credentialsRequired: false,
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth.user',
    getToken: getToken('jwt.user')
  }),
  async (req, res, next) => {
    const { auth } = req;

    if (auth && auth.user) {
      req.user = await User.query()
        .where('email', auth.user.email)
        .first();
    }

    next();
  }
);

export default authMiddleware;
