import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import userRoutes from "./modules/user/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// REST API routes
app.use("/api/users", userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// GraphQL Server setup
export async function startGraphQL() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    await apolloServer.start();
    console.log("GraphQL server started");
  } catch (err) {
    console.error("Failed to start GraphQL server:", err);
  }
}

export default app;