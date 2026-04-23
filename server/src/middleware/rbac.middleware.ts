import { hasPermission } from "../modules/rbac/permission.service";

export const authorize = async (user: any, permissionCode: string) => {
  if (!user) {
    throw new Error("Authentication required");
  }

  // CEO and ADMIN bypass all checks for simplicity in this enterprise logic
  if (user.role === "CEO" || user.role === "ADMIN") return;

  const allowed = await hasPermission(user.role, permissionCode);

  if (!allowed) {
    throw new Error(`Access denied. Missing permission: ${permissionCode}`);
  }
};
