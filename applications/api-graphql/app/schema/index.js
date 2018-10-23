import { makeExecutableSchema } from 'graphql-tools';
import { typeDef as Base } from './Base';
import { typeDef as PageInfo } from './PageInfo';
import { typeDef as Product, resolvers as productResolvers } from './Product';
import { typeDef as Variant, resolvers as variantResolvers } from './Variant';
import { typeDef as User, resolvers as userResolvers } from './User';

export default makeExecutableSchema({
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  typeDefs: [ Base, PageInfo, Product, Variant, User ],
  resolvers: [ userResolvers, productResolvers, variantResolvers ]
});
