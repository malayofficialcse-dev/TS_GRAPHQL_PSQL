import * as orderService from "./order.service.js";

export const orderResolvers = {
    Query: {
        getOrders: async () => {
            return await orderService.getOrders();
        },
        getOrderById: async (_: unknown, args: { id: number }) => {
            return await orderService.getOrderById(args.id);
        },
    },
    Mutation: {
        createOrder: async (
            _: unknown,
            args: { user_id: number; product_id: number }
        ) => {
            return await orderService.createOrder({
                user_id: args.user_id,
                product_id: args.product_id,
            });
        },
        updateOrder: async (
            _: unknown,
            args: { id: number; user_id: number; product_id: number }
        ) => {
            return await orderService.updateOrder(
                args.id,
                args.user_id,
                args.product_id
            );
        },
        deleteOrder: async (_: unknown, args: { id: number }) => {
            return await orderService.deleteOrder(args.id);
        },
    },
};
