import { Router } from "express";
import * as categoryController from "./category.controller.js";

const router = Router();

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id", categoryController.updateCategory);

export default router;
