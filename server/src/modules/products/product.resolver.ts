import * as productService from "./product.service.js";
import { authorize } from "../../middleware/rbac.middleware";
import { ProductSchema } from "../../middleware/validation";
import { logAction } from "../audit/audit.service";

export const productResolvers = {
    Query: {
        getProducts: async (_: any, args: { limit?: number; offset?: number; search?: string }) => {
            return await productService.getProducts(args.limit, args.offset, args.search);
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
            
            // Validate
            ProductSchema.parse({
                name: args.name,
                price: Number(args.price),
                category_id: args.category_id ? Number(args.category_id) : undefined
            });

            const product = await productService.createProduct({
                name: args.name,
                price: args.price,
                category_id: args.category_id,
            });

            await logAction(context.user.id, "CREATE", "PRODUCT", `Product: ${product.name}`);
            return product;
        },
        updateProduct: async (
            _: unknown,
            args: { id: number; name: string; price: number; category_id?: number },
            context: any
        ) => {
            await authorize(context.user, "product:write");
            
            ProductSchema.parse({
                name: args.name,
                price: Number(args.price),
                category_id: args.category_id ? Number(args.category_id) : undefined
            });

            const product = await productService.updateProduct(
                args.id,
                args.name,
                args.price,
                args.category_id
            );

            await logAction(context.user.id, "UPDATE", "PRODUCT", `Product ID: ${args.id}`);
            return product;
        },
        deleteProduct: async (_: unknown, args: { id: number }, context: any) => {
            await authorize(context.user, "product:delete");
            const res = await productService.deleteProduct(args.id);
            await logAction(context.user.id, "DELETE", "PRODUCT", `Product ID: ${args.id}`);
            return res;
        },
    },
};
