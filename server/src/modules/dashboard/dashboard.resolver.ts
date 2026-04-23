import * as dashboardService from "./dashboard.service";
import { authorize } from "../../middleware/rbac.middleware";

export const dashboardResolvers = {
    Query: {
        getDashboardStats: async (_: any, __: any, context: any) => {
            // Usually manager or admin sees dashboard
            await authorize(context.user, "order:read");
            return await dashboardService.getStats();
        }
    }
};
