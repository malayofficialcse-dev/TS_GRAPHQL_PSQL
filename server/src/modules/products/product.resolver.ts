import * as productService from "./product.service.js";
import { authorize } from "../../middleware/rbac.middleware";

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
            context: any
        ) => {
            await authorize(context.user, "product:write");
            return await productService.createProduct({
                name: args.name,
                price: args.price,
                category_id: args.category_id,
            });
        },
        updateProduct: async (
            _: unknown,
            args: { id: number; name: string; price: number; category_id?: number },
            context: any
        ) => {
            await authorize(context.user, "product:write");
            return await productService.updateProduct(
                args.id,
                args.name,
                args.price,
                args.category_id
            );
        },
        deleteProduct: async (_: unknown, args: { id: number }, context: any) => {
            await authorize(context.user, "product:delete");
            return await productService.deleteProduct(args.id);
        },
    },
};
