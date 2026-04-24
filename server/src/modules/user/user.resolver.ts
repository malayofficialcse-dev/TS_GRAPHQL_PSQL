import * as userService from "./user.service";
import { authorize } from "../../middleware/rbac.middleware";

export const userResolvers = {
    Query: {
        getUsers: async (_: any, __: any, context: any) => {
            authorize(context.user, ["ADMIN"]);
            return await userService.getUsers();
        },
        getUserById: async (_: any, args: { id: number }, context: any) => {
            // Allow users to see their own profile or Admin to see any
            const user = await userService.getUserById(args.id);
            if (context.user?.role !== "ADMIN" && context.user?.id !== args.id) {
                throw new Error("Access denied");
            }
            return user;
        },
    },

    Mutation: {
        createUser: async (_: any, args: any) => {
            return await userService.createUser(args);
        },
        deleteUser: async (_: any, args: { id: number }, context: any) => {
            authorize(context.user, ["ADMIN"]);
            await userService.deleteUser(args.id);
            return "User deleted";
        },
        updateUser: async (_: any, args: any, context: any) => {
            authorize(context.user, ["ADMIN", "MANAGER"]);
            return await userService.updateUser(args.id, args.name, args.role);
        }
    },
};
