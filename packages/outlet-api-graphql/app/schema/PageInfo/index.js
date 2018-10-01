import { gql } from 'apollo-server';

export const typeDef = gql`
  type PageInfo {
    # When paginating forwards, are there more items?
    hasNextPage: Boolean!

    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean!

    # When paginating backwards, the cursor to continue.
    startCursor: Cursor

    # When paginating forwards, the cursor to continue.
    endCursor: Cursor
  }
`;

export const resolvers = {};
