import { gql } from 'apollo-server';

export const typeDef = gql`
  scalar OptionsList

  type Variant implements Node {
    nodeId: ID!
    id: Int!
    productId: Int!
    isMaster: Boolean
    priceInCents: Int!
    sku: String
    barcode: String
    options: OptionsList
  }
  
  input VariantInput {
    id: Int
    isMaster: Boolean
    priceInCents: Int
    sku: String
    barcode: String
    options: OptionsList
  }
`;

export const resolvers = {
  Query: {},
  Mutation: {}
};
