import * as productService from "./product.service.js";
import * as categoryService from "../category/category.service.js";
import { authorize } from "../../middleware/rbac.middleware.js";
import { UserRole } from "../user/user.model.js";

type ResolverContext = {
    user?: { role?: UserRole } | null;
};

export const productResolvers = {
    Query: {
        getProducts: async () => {
            return await productService.getProducts();
        },
        getProductById: async (_: unknown, args: { id: number }) => {
            return await productService.getProductById(args.id);
        },
    },
    Mutation: {
        createProduct: async (
            _: unknown,
            args: { name: string; price: number; category_id?: number },
            context: ResolverContext
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await productService.createProduct({
                name: args.name,
                price: args.price,
                category_id: args.category_id,
            });
        },
        updateProduct: async (
            _: unknown,
            args: { id: number; name: string; price: number; category_id?: number },
            context: ResolverContext
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await productService.updateProduct(
                args.id,
                args.name,
                args.price,
                args.category_id
            );
        },
        deleteProduct: async (
            _: unknown,
            args: { id: number },
            context: ResolverContext
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await productService.deleteProduct(args.id);
        },
    },
    Product: {
        category: async (parent: { category_id?: number }) => {
            if (!parent.category_id) {
                return null;
            }

            return await categoryService.getCategoryById(parent.category_id);
        },
    },
};
