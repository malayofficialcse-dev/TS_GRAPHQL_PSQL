import * as orderService from "./order.service.js";
import * as userService from "../user/user.service.js";
import * as productService from "../products/product.service.js";
import { authorize } from "../../middleware/rbac.middleware";

export const orderResolvers = {
    Query: {
        getOrders: async (_: any, __: any, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await orderService.getOrders();
        },
        getOrderById: async (_: unknown, args: { id: number }, context: any) => {
            const order = await orderService.getOrderById(args.id);
            if (context.user?.role !== "ADMIN" && context.user?.role !== "MANAGER" && context.user?.id !== order?.user_id) {
                throw new Error("Access denied");
            }
            return order;
        },
        getOrdersByStatus: async (_: unknown, args: { status: string }, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await orderService.getOrdersByStatus(args.status);
        },
        getOrdersByCategory: async (_: unknown, args: { category_id: number }, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await orderService.getOrdersByCategory(args.category_id);
        },
    },
    Mutation: {
        createOrder: async (
            _: unknown,
            args: { user_id: number; product_id: number; quantity: number; status: string },
            context: any
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER", "USER"]);
            return await orderService.createOrder({
                user_id: args.user_id,
                product_id: args.product_id,
                quantity: args.quantity,
                total_price: 0, // Will be calculated
                status: args.status,
            });
        },
        updateOrder: async (
            _: unknown,
            args: { id: number; user_id: number; product_id: number; quantity: number; total_price: number; status: string },
            context: any
        ) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await orderService.updateOrder(
                args.id,
                args.user_id,
                args.product_id,
                args.quantity,
                args.total_price,
                args.status
            );
        },
        deleteOrder: async (_: unknown, args: { id: number }, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await orderService.deleteOrder(args.id);
        },
    },
    Order: {
        user: async (parent: { user_id: number }) => {
            return await userService.getUserById(parent.user_id);
        },
        product: async (parent: { product_id: number }) => {
            return await productService.getProductById(parent.product_id);
        },
    },
    User: {
        orders: async (parent: { id: number }) => {
            return await orderService.getOrdersByUserId(parent.id);
        },
    },
    Product: {
        orders: async (parent: { id: number }) => {
            return await orderService.getOrdersByProductId(parent.id);
        },
    },
};
