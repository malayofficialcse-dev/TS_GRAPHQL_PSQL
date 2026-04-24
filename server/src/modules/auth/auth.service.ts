import bcrypt from "bcrypt";
import {pool} from "../../config/db";
import *  as q from "./auth.query";
import { generateToken } from "../../config/jwt";

export const signup = async (name:string,email:string,password:string) => {
    const hashed = await bcrypt.hash(password,10);

    const res = await pool.query(q.CREATE_USER,[name,email,hashed,"USER"]);
    const user = res.rows[0];

    const token = generateToken(user);
    return {user,token};
};


export const login = async (email:string,password:string) => {
    const res = await pool.query(q.FIND_USER_BY_EMAIL,[email]);
    const user = res.rows[0];

    if(!user){
        throw new Error ("User not found");
    }

    const isValid = await bcrypt.compare(password,user.password);
    
    if(!isValid){
        throw new Error("Invalid password");
    }

    const token = generateToken(user);
    return {user,token};
};
