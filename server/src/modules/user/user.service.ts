import { pool } from "../../config/db.js";
import * as queries from "./user.query.js";
import { User } from "./user.model.js";


export const createUserTable = async () => {
    await pool.query(queries.CREATE_USER_TABLE);
};

export const createUser = async (user:User) => {
    const {name,email,password,role = "USER"} = user;
    const result = await pool.query(queries.INSERT_USER, [name, email, password, role]);
    return result.rows[0];
};

export const getUsers = async () => {
    const result = await pool.query(queries.GET_USERS);
    return result.rows;
};

export const getUserById = async (id:number) => {
    const result = await pool.query(queries.GET_USER_BY_ID,[id]);
    return result.rows[0];
};

export const deleteUser = async (id : number) => {
    await pool.query(queries.DELETE_USER,[id]);
};

export const updateUser = async (id:number,name:string,role:string = "USER") => {
    const res = await pool.query(queries.UPDATE_USER,[name,role,id]);
    return res.rows[0];
};

