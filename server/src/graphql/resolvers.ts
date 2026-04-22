import { authResolver } from "../modules/auth/auth.resolver";
import { categoryResolvers } from "../modules/category/category.resolver.js";
import { userResolvers } from "../modules/user/user.resolver";
import { productResolvers } from "../modules/products/product.resolver";

export const resolvers = {
  Query: {
    ...categoryResolvers.Query,
    ...productResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...categoryResolvers.Mutation,
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
    ...authResolver.Mutation,
  },
};
