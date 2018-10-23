import { gql } from 'apollo-server';
import currentUser from './resolvers/currentUser';
import user from './resolvers/user';
import findUser from './resolvers/findUser';
import allUsers from './resolvers/allUsers';
import logoutUser from './resolvers/logoutUser';
import loginUser from './resolvers/loginUser';
import createUser from './resolvers/createUser';

export const typeDef = gql`
  extend type Query {
    currentUser: User
    findUser(id: Int, email: String): User
    user(id: Int): User
    allUsers(
      """
      Only return the first \`n\` values of the set.
      """
      first: Int

      """
      Only return the last \`n\` values of the set.
      """
      last: Int

      """
      Skip the first \`n\` values from our after cursor, an alternative to
      cursor based pagination. May not be used with \`last\`.
      """
      offset: Int

      "Read all values in the set before (above) this cursor."
      before: Cursor

      "Read all values in the set after (before) this cursor."
      after: Cursor

      "The columns to order users by."
      orderBy: [OrderUsersBy!] = [ID_DESC]

      "The conditions to use when determining which users to return."
      condition: UserCondition
    ): UsersConnection
  }

  extend type Mutation {
    logoutUser: Boolean
    loginUser(email: String!, password: String!): UserAuthPayload
    createUser(
      firstName: String!
      lastName: String
      role: String
      username: String!
      email: String!
      password: String!
    ): User
  }

  type User implements Node {
    nodeId: ID!
    id: Int!
    guid: String
    role: String!
    firstName: String
    lastName: String
    email: String!
    password: String!
  }

  type UserAuthPayload {
    token: String
    user: User
  }

  type UsersConnection {
    "A list of \`User\` objects."
    nodes: [User]!

    """
    A list of edges which contains the \`User\` and cursor to aid in pagination.
    """
    edges: [UsersEdge!]!

    "Information to aid in pagination."
    pageInfo: PageInfo!

    "The total count of all Users possible from the connection."
    totalCount: Int
  }

  type UsersEdge {
    cursor: Cursor
    node: User
  }

  input UserCondition {
    "Matches a specific ID."
    id: Int

    "Fuzzy matches the first name."
    firstName: String

    "Fuzzy matches the last name."
    lastName: String

    "Fuzzy matches the email."
    email: String

    "Checks for equality with the object's role field."
    role: String
  }

  enum OrderUsersBy {
    ID_ASC
    ID_DESC
    FIRST_NAME_ASC
    FIRST_NAME_DESC
    LAST_NAME_ASC
    LAST_NAME_DESC
    EMAIL_ASC
    EMAIL_DESC
    CREATED_AT_ASC
    CREATED_AT_DESC
    UPDATED_AT_ASC
    UPDATED_AT_DESC
  }
`;

export const resolvers = {
  Query: {
    currentUser,
    findUser,
    user,
    allUsers
  },
  Mutation: {
    logoutUser,
    loginUser,
    createUser
  }
};
