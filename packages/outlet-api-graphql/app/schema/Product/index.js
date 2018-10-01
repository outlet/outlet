import { gql } from 'apollo-server';
import findProduct from './resolvers/findProduct';
import product from './resolvers/product';
import allProducts from './resolvers/allProducts';
import createProduct from './resolvers/createProduct';
import updateProduct from './resolvers/updateProduct';

export const typeDef = gql`
  extend type Query {
    findProduct(id: Int, slug: String): Product
    product(id: Int, slug: String): Product
    allProducts(
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
    createProduct(
      name: String,
      description: String,
      variants: [VariantInput]
    ): Product
    updateProduct(
      id: Int!,
      name: String,
      description: String,
      variants: [VariantInput]
    ): Product
  }

  type Product implements Node {
    nodeId: ID!
    id: Int!
    name: String!
    description: String
    slug: String!
    variants: [Variant]
    createdAt: String
    updatedAt: String
  }

  type ProductsConnection {
    "A list of \`Product\` objects."
    nodes: [Product]!

    """
    A list of edges which contains the \`Product\` and cursor to aid in
    pagination.
    """
    edges: [ProductsEdge!]!

    "Information to aid in pagination."
    pageInfo: PageInfo!

    "The total count of all Products possible from the connection."
    totalCount: Int
  }

  type ProductsEdge {
    cursor: Cursor
    node: Product
  }

  input ProductCondition {
    "Matches a specific ID."
    id: Int

    "Fuzzy matches the name."
    name: String
  }

  enum OrderProductsBy {
    ID_ASC
    ID_DESC
    NAME_ASC
    NAME_DESC
    CREATED_AT_ASC
    CREATED_AT_DESC
    UPDATED_AT_ASC
    UPDATED_AT_DESC
  }
`;

export const resolvers = {
  Query: {
    allProducts,
    findProduct,
    product
  },
  Mutation: {
    createProduct,
    updateProduct
  }
};
