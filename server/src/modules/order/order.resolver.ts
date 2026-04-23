import * as orderService from "./order.service.js";
import * as userService from "../user/user.service.js";
import * as productService from "../products/product.service.js";
import { authorize } from "../../middleware/rbac.middleware";
import { OrderSchema } from "../../middleware/validation";
import { logAction } from "../audit/audit.service";

export const orderResolvers = {
    Query: {
        getOrders: async (_: any, __: any, context: any) => {
            await authorize(context.user, "order:read");
            return await orderService.getOrders();
        },
        getOrderById: async (_: unknown, args: { id: number }, context: any) => {
            const order = await orderService.getOrderById(args.id);
            // Allow self-view or check order:read permission
            if (context.user?.id !== order?.user_id) {
                await authorize(context.user, "order:read");
            }
            return order;
        },
        getOrdersByStatus: async (_: unknown, args: { status: string }, context: any) => {
            await authorize(context.user, "order:read");
            return await orderService.getOrdersByStatus(args.status);
        },
        getOrdersByCategory: async (_: unknown, args: { category_id: number }, context: any) => {
            await authorize(context.user, "order:read");
            return await orderService.getOrdersByCategory(args.category_id);
        },
    },
    Mutation: {
        createOrder: async (
            _: unknown,
            args: { user_id: number; product_id: number; quantity: number; status: string },
            context: any
        ) => {
            await authorize(context.user, "order:write");
            
            // Validate input
            OrderSchema.parse({
                user_id: Number(args.user_id),
                product_id: Number(args.product_id),
                quantity: Number(args.quantity),
                status: args.status
            });

            const order = await orderService.createOrder({
                user_id: args.user_id,
                product_id: args.product_id,
                quantity: args.quantity,
                total_price: 0, // Will be calculated
                status: args.status,
            });

            await logAction(context.user.id, "CREATE", "ORDER", `Order ID: ${order.id}`);
            return order;
        },
        updateOrder: async (
            _: unknown,
            args: { id: number; user_id: number; product_id: number; quantity: number; total_price: number; status: string },
            context: any
        ) => {
            await authorize(context.user, "order:status");
            
            const order = await orderService.updateOrder(
                args.id,
                args.user_id,
                args.product_id,
                args.quantity,
                args.total_price,
                args.status
            );

            await logAction(context.user.id, "UPDATE_STATUS", "ORDER", `Order ID: ${args.id}, Status: ${args.status}`);
            return order;
        },
        deleteOrder: async (_: unknown, args: { id: number }, context: any) => {
            await authorize(context.user, "order:delete");
            const res = await orderService.deleteOrder(args.id);
            await logAction(context.user.id, "DELETE", "ORDER", `Order ID: ${args.id}`);
            return res;
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
};
