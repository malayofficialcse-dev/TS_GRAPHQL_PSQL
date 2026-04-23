import * as userService from "./user.service";
import { authorize } from "../../middleware/rbac.middleware";

export const userResolvers = {
    Query: {
        getUsers: async (_: any, __: any, context: any) => {
            await authorize(context.user, "user:read");
            return await userService.getUsers();
        },
        getUserById: async (_: any, args: { id: number }, context: any) => {
            const user = await userService.getUserById(args.id);
            // Allow self-view or check user:read permission
            if (context.user?.id !== args.id) {
                await authorize(context.user, "user:read");
            }
            return user;
        },
    },

    Mutation: {
        createUser: async (_: any, args: any) => {
            return await userService.createUser(args);
        },
        deleteUser: async (_: any, args: { id: number }, context: any) => {
            await authorize(context.user, "user:delete");
            await userService.deleteUser(args.id);
            return "User deleted";
        },
        updateUser: async (_: any, args: any, context: any) => {
            await authorize(context.user, "user:write");
            return await userService.updateUser(args.id, args.name, args.role);
        }
    },
};
