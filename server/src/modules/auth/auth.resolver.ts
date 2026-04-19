import * as services from "./auth.service";

export const authResolver = {
    Mutation : {
        signup: async (_:any,args:any) => {
            return await services.signup(args.name,args.email,args.password);
        },

        login: async (_:any,args:any) => {
            return await services.login(args.email,args.password);
        }
    },
}
