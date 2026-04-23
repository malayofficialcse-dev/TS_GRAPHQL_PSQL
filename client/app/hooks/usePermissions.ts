import { useAuth } from "../components/AuthProvider";

export const usePermissions = () => {
  const { user } = useAuth();
  
  // CEO and ADMIN are superusers
  const isSuperuser = user?.role === "CEO" || user?.role === "ADMIN";

  const hasPermission = (permissionCode: string) => {
    if (isSuperuser) return true;
    return user?.permissions?.includes(permissionCode) || false;
  };

  return { hasPermission, isSuperuser, role: user?.role };
};
