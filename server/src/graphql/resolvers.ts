import { authResolver } from "../modules/auth/auth.resolver";
import { categoryResolvers } from "../modules/category/category.resolver.js";
import { userResolvers } from "../modules/user/user.resolver";

export const resolvers = {
  Query: {
    ...categoryResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...categoryResolvers.Mutation,
    ...userResolvers.Mutation,
    ...authResolver.Mutation,
  },
};
