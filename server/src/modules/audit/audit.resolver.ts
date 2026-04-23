import * as auditService from "./audit.service";
import { authorize } from "../../middleware/rbac.middleware";

export const auditResolvers = {
    Query: {
        getAuditLogs: async (_: any, args: { limit?: number; offset?: number }, context: any) => {
            // Only CEO or ADMIN should see audit logs
            await authorize(context.user, "user:read"); 
            return await auditService.getAuditLogs(args.limit, args.offset);
        }
    }
};
