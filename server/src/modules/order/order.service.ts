import { pool } from "../../config/db.js";
import * as queries from "./order.query.js";
import { Order } from "./order.model.js";

export const createOrderTable = async () => {
    await pool.query(queries.CREATE_ORDER_TABLE);
};

export const createOrder = async (order: Order) => {
    const result = await pool.query(queries.CREATE_ORDER, [
        order.user_id,
        order.product_id,
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

export const updateOrder = async (
    id: number,
    user_id: number,
    product_id: number
) => {
    const result = await pool.query(queries.UPDATE_ORDER, [
        user_id,
        product_id,
        id,
    ]);

    return result.rows[0];
};

export const deleteOrder = async (id: number) => {
    const result = await pool.query(queries.DELETE_ORDER, [id]);
    return result.rows[0];
};
