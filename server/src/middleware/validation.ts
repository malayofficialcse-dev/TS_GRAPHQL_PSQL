import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CEO", "CTO", "ADMIN", "MANAGER", "HR", "FINANCE", "USER"]).optional(),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  category_id: z.number().int().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export const OrderSchema = z.object({
  user_id: z.number().int(),
  product_id: z.number().int(),
  quantity: z.number().int().positive(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
});
