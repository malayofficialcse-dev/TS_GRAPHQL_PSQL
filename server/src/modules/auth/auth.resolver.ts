import * as services from "./auth.service";

export const authResolver = {
    Mutation : {
        signup:(_:any,args:any) => {
            services.signup(args.name,args.email,args.password)
        },

        login:(_:any,args:any) => {
            services.login(args.email,args.password)
        }
    },
}