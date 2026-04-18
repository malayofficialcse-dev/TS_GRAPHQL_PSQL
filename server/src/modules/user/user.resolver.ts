import * as userService from "./user.service";

export const userResolvers = {
    Query: {
        getUsers: async () => {
            return await userService.getUsers();
        },
        getUserById: async (_: any, args: { id: number }) => {
            return await userService.getUserById(args.id);
        },
    },

    Mutation: {
        createUser: async (_: any, args: any) => {
            return await userService.createUser(args);
        },
        deleteUser: async (_: any, args: { id: number }) => {
            await userService.deleteUser(args.id);
            return "User deleted";
        },
        updateUser:(_:any,args:any) => {
            userService.updateUser(args.id,args.name);
        }
    },
};