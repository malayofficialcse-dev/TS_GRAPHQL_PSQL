import { Request, Response } from "express";
import * as categoryService from "./category.service.js";

type PostgresError = {
  code?: string;
  message?: string;
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await categoryService.createCategory({ name });
    return res.status(201).json(category);
  } catch (err) {
    const pgError = err as PostgresError | null;

    if (pgError?.code === "23505") {
      return res.status(409).json({ error: "Category name must be unique" });
    }
    console.error("Create category error:", err);
    return res.status(500).json({
      error: "Failed to create category",
      details: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  return res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if(Number.isNaN(id)){
    return res.status(400).json({error:"Invalid category id"});
  }

  const category = await categoryService.getCategoryById(Number(req.params.id));
  return res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  await categoryService.deleteCategory(Number(req.params.id));
  return res.json({ message: "Category deleted successfully" });
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid category id" });
  }

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const category = await categoryService.updateCategory(id, name);
  return res.json(category);
};
