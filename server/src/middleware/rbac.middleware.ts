import { UserRole } from "../modules/user/user.model";

export const authorize = (user: any, roles: UserRole[]) => {
  if (!user) {
    throw new Error("Authentication required");
  }

  if (!roles.includes(user.role)) {
    throw new Error(`Access denied. Your role: ${user.role}. Required roles: ${roles.join(", ")}`);
  }
};
