import { pool } from "../../config/db.js";
import * as queries from "./product.query.js";
import { Product } from "./product.model.js";

export const createProductTable = async () => {
    await pool.query(queries.CREATE_PRODUCT_TABLE);
};


export const createProduct = async (product:Product) => {
    const result = await pool.query(queries.CREATE_PRODUCT,[
        product.name,
        product.price,
        product.category_id ?? null,
    ]);

    return result.rows[0];
}

export const getProducts = async (limit: number = 100, offset: number = 0, search?: string) => {
    let query = queries.GET_PRODUCTS;
    const params: any[] = [limit, offset];
    
    if (search) {
        query += ` WHERE name ILIKE $3`;
        params.push(`%${search}%`);
    }
    
    query += ` LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, params);
    return result.rows;
};

export const getProductById = async (id: number) => {
    const result = await pool.query(queries.GET_PRODUCT_BY_ID, [id]);
    return result.rows[0];
};

export const updateProduct =  async (
    id:number,
    name:string,
    price:number,
    category_id?:number
) => {
    const result = await pool.query(queries.UPDATE_PRODUCT,[
        name,
        price,
        category_id ?? null,
        id,
    ]);
    return result.rows[0];
};

export const deleteProduct = async (id:number) => {
    const result = await pool.query(queries.DELETE_PRODUCT,[id]);
    return result.rows[0];
}
