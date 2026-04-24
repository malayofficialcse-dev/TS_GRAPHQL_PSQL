import { authResolver } from "../modules/auth/auth.resolver";
import { categoryResolvers } from "../modules/category/category.resolver.js";
import { orderResolvers } from "../modules/order/order.resolver.js";
import { userResolvers } from "../modules/user/user.resolver";
import { productResolvers } from "../modules/products/product.resolver";

export const resolvers = {
  Query: {
    ...categoryResolvers.Query,
    ...orderResolvers.Query,
    ...productResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...categoryResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
    ...authResolver.Mutation,
  },
  Category: {
    ...categoryResolvers.Category,
  },
  Order: {
    ...orderResolvers.Order,
  },
  User: {
    ...orderResolvers.User,
  },
  Product: {
    ...productResolvers.Product,
    ...orderResolvers.Product,
  },
};
