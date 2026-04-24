import { UserRole } from "../modules/user/user.model.js";

export const authorize = (user: { role?: UserRole } | null | undefined, roles: UserRole[]) => {
    if (!user) {
        throw new Error("Authentication required");
    }

    if (!user.role || !roles.includes(user.role)) {
        throw new Error(
            `Access denied. Your role: ${user.role ?? "unknown"}. Required roles: ${roles.join(", ")}`
        );
    }
};
