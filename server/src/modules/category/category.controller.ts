import { Request, Response } from "express";
import * as categoryService from "./category.service.js";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await categoryService.createCategory({ name });
    return res.status(201).json(category);
  } catch (err) {
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
  const category = await categoryService.getCategoryById(Number(req.params.id));
  return res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  await categoryService.deleteCategory(Number(req.params.id));
  return res.json({ message: "Category deleted successfully" });
};
