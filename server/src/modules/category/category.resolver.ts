import * as categoryService from "./category.service.js";
import * as productService from "../products/product.service.js";
import { authorize } from "../../middleware/rbac.middleware.js";
import { UserRole } from "../user/user.model.js";

type ResolverContext = {
    user?: { role?: UserRole } | null;
};

export const categoryResolvers = {
    Query: {
        getCategories: async () => {
            return await categoryService.getCategories();
        },
        getCategoryById: async (_: unknown, args: { id: number }) => {
            return await categoryService.getCategoryById(args.id);
        },
    },
    Mutation: {
        createCategory: async (
            _: unknown,
            args: { name: string },
            context: ResolverContext
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await categoryService.createCategory({ name: args.name });
        },
        deleteCategory: async (
            _: unknown,
            args: { id: number },
            context: ResolverContext
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            await categoryService.deleteCategory(args.id);
            return "Category deleted";
        },
        updateCategory: async (
            _: unknown,
            args: { id: number; name: string },
            context: ResolverContext
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await categoryService.updateCategory(args.id, args.name);
        },
    },
    Category: {
        products: async (parent: { id: number }) => {
            return await productService.getProductsByCategoryId(parent.id);
        },
    },
};
