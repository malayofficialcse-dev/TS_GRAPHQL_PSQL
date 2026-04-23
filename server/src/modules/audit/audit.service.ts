import { pool } from "../../config/db";

export const logAction = async (userId: number | null, action: string, module: string, details?: string, ip?: string) => {
  try {
    const query = `
      INSERT INTO audit_logs (user_id, action, module, details, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [userId, action, module, details, ip]);
  } catch (err) {
    console.error("Failed to save audit log:", err);
  }
};

export const getAuditLogs = async (limit = 100, offset = 0) => {
  const query = `
    SELECT al.*, u.email as user_email, u.name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const res = await pool.query(query, [limit, offset]);
  return res.rows;
};
