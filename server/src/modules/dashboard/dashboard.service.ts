import { pool } from "../../config/db";

export const getStats = async () => {
  const usersCount = await pool.query("SELECT COUNT(*) FROM users");
  const productsCount = await pool.query("SELECT COUNT(*) FROM products");
  const ordersCount = await pool.query("SELECT COUNT(*) FROM orders");
  const totalRevenue = await pool.query("SELECT SUM(total_price) FROM orders WHERE status = 'COMPLETED'");

  // Orders by day for chart
  const ordersByDay = await pool.query(`
    SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count, SUM(total_price) as revenue
    FROM orders
    GROUP BY date
    ORDER BY date ASC
    LIMIT 7
  `);

  return {
    totalUsers: parseInt(usersCount.rows[0].count),
    totalProducts: parseInt(productsCount.rows[0].count),
    totalOrders: parseInt(ordersCount.rows[0].count),
    totalRevenue: parseFloat(totalRevenue.rows[0].sum || "0"),
    recentActivity: ordersByDay.rows.map(r => ({
      date: r.date.toISOString().split('T')[0],
      orders: parseInt(r.count),
      revenue: parseFloat(r.revenue || "0")
    }))
  };
};
