import { pool } from "../../config/db.js";
import * as queries from "./order.query.js";
import { Order } from "./order.model.js";
import * as productService from "../products/product.service.js";
import * as userService from "../user/user.service.js";

export const createOrderTable = async () => {
    await pool.query(queries.CREATE_ORDER_TABLE);
};

export const createOrder = async (order: Order) => {
    // Validate user exists
    const user = await userService.getUserById(order.user_id);
    if (!user) {
        throw new Error("User not found");
    }

    // Validate product exists and get price
    const product = await productService.getProductById(order.product_id);
    if (!product) {
        throw new Error("Product not found");
    }

    // Calculate total price
    const calculatedTotal = product.price * order.quantity;

    const result = await pool.query(queries.CREATE_ORDER, [
        order.user_id,
        order.product_id,
        order.quantity,
        calculatedTotal,
        order.status,
    ]);

    return result.rows[0];
};

export const getOrders = async () => {
    const result = await pool.query(queries.GET_ORDERS);
    return result.rows;
};

export const getOrderById = async (id: number) => {
    const result = await pool.query(queries.GET_ORDER_BY_ID, [id]);
    return result.rows[0];
};

export const getOrdersByUserId = async (user_id: number) => {
    const result = await pool.query(queries.GET_ORDERS_BY_USER_ID, [user_id]);
    return result.rows;
};

export const getOrdersByProductId = async (product_id: number) => {
    const result = await pool.query(queries.GET_ORDERS_BY_PRODUCT_ID, [product_id]);
    return result.rows;
};

export const getOrdersByStatus = async (status: string) => {
    const result = await pool.query(queries.GET_ORDERS_BY_STATUS, [status]);
    return result.rows;
};

export const getOrdersByCategory = async (category_id: number) => {
    const result = await pool.query(queries.GET_ORDERS_BY_CATEGORY, [category_id]);
    return result.rows;
};

export const updateOrder = async (
    id: number,
    user_id: number,
    product_id: number,
    quantity: number,
    total_price: number,
    status: string
) => {
    const result = await pool.query(queries.UPDATE_ORDER, [
        user_id,
        product_id,
        quantity,
        total_price,
        status,
        id,
    ]);

    return result.rows[0];
};

export const deleteOrder = async (id: number) => {
    const result = await pool.query(queries.DELETE_ORDER, [id]);
    return result.rows[0];
};
