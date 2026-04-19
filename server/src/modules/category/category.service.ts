import { pool } from "../../config/db.js";
import * as queries from "./category.query.js";
import { Category } from "./category.model.js";

export const createCategoryTable = async () => {
    await pool.query(queries.CREATE_CATEGORY_TABLE);
};

export const createCategory = async (category: Category) => {
    const result = await pool.query(queries.CREATE_CATEGORY, [category.name]);
    return result.rows[0];
};

export const getCategories = async () => {
    const result = await pool.query(queries.GET_CATEGORIES);
    return result.rows;
};

export const getCategoryById = async (id: number) => {
    const result = await pool.query(queries.GET_CATEGORY_BY_ID, [id]);
    return result.rows[0];
};

export const deleteCategory = async (id: number) => {
    await pool.query(queries.DELETE_CATEGORY, [id]);
};
