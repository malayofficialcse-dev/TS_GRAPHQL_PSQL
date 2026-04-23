import * as categoryService from "./category.service.js";
import { authorize } from "../../middleware/rbac.middleware";

export const categoryResolvers = {
    Query: {
        getCategories: async () => {
            return await categoryService.getCategories();
        },
        getCategoryById: async (_: unknown, args: { id: number }) => {
            return await categoryService.getCategoryById(args.id);
        },
    },
    Mutation: {
        createCategory: async (_: unknown, args: { name: string }, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await categoryService.createCategory({ name: args.name });
        },
        deleteCategory: async (_: unknown, args: { id: number }, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            await categoryService.deleteCategory(args.id);
            return "Category deleted";
        },
        updateCategory: async (_: unknown, args: { id: number, name: string }, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await categoryService.updateCategory(args.id, args.name);
        }
    },
};
