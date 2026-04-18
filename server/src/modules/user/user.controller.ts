import { Request, Response } from "express";
import * as userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user", details: err instanceof Error ? err.message : String(err) });
  }
};

export const getUsers = async (_req:Request,res:Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const getUserById = async (req:Request,res:Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  res.json(user);
}

export const deleteUser = async (req:Request,res:Response) => {
  await userService.deleteUser(Number(req.params.id));
  res.json({message:"User deleted successfully"});
};