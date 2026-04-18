import { authResolver } from "../modules/auth/auth.resolver";
import { userResolvers } from "../modules/user/user.resolver";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolver.Mutation,
  },
};