import { Router } from "express";
import * as userController from "./user.controller";

const router = Router();

router.post("/", userController.createUser);
router.get("/",userController.getUsers);
router.get("/:id",userController.getUserById);
router.delete("/:id",userController.deleteUser);

export default router;