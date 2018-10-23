import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { formatError } from 'apollo-errors';
import { ApolloServer } from 'apollo-server-express';
import { https, auth } from '@middleware';
import { Model } from 'objection';
import { getEnv } from '@lib/env';
import schema from '@schema';
import db from '@db';

const server = new express();
const env = getEnv('NODE_ENV', 'development');
const origin = getEnv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',');
const cors = { credentials: true, origin };
const apollo = new ApolloServer({
  schema,
  formatError,
  context: ({ req, res }) => ({
    res,
    user: req.user,
    member: req.member
  }),

  // NOTE: required for now
  // https://github.com/prisma/graphql-playground/issues/790
  playground: {
    settings: {
      'editor.cursorShape': 'line',
      'request.credentials': 'include'
    }
  }
});

// Bind all Objection.js models to Knex
Model.knex(db);

// Secure with helmet
server.use(helmet());

// Always redirect to https in production
server.use(https({ enabled: env === 'production' }));

// parse cookies
server.use(cookieParser());

// Mount authentication middleware for JWT
server.use(auth);

// Mount GraphQL Service
apollo.applyMiddleware({ path: '/', app: server, cors });

export default server;
