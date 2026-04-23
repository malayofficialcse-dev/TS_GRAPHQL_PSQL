import { pool } from "../../config/db";

export const getPermissionsForRole = async (roleName: string): Promise<string[]> => {
  const query = `
    SELECT p.code 
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON r.id = rp.role_id
    WHERE r.name = $1;
  `;
  const res = await pool.query(query, [roleName]);
  return res.rows.map(row => row.code);
};

export const hasPermission = async (roleName: string, permissionCode: string): Promise<boolean> => {
  // CEO bypass
  if (roleName === "CEO" || roleName === "ADMIN") return true;

  const query = `
    SELECT 1 
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON r.id = rp.role_id
    WHERE r.name = $1 AND p.code = $2;
  `;
  const res = await pool.query(query, [roleName, permissionCode]);
  return res.rowCount > 0;
};
