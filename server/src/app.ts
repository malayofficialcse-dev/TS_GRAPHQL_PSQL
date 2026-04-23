import express from "express";
import cors from "cors";
import categoryRoutes from "./modules/category/category.route.js";
import userRoutes from "./modules/user/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// REST API routes
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
