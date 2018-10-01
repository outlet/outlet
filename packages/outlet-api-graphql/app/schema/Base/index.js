import { gql } from 'apollo-server';
import { createResolver } from 'apollo-resolvers';
import { isInstance } from 'apollo-errors';
import { UnknownError } from '@schema/errors';
import yn from 'yn';

const debug = yn(process.env.DEBUG);

export const typeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  interface Node {
    nodeId: ID!
  }

  scalar Cursor
`;

export const baseResolver = createResolver(
  null,
  // Only mask outgoing errors that aren't already apollo-errors, such as ORM
  // errors, etc
  (root, args, context, error) => {
    if (debug) console.error(error);

    return isInstance(error) ? error : new UnknownError();
  }
);
