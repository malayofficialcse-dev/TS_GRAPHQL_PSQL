import app from "./app";
import dotenv from "dotenv";
import { createUserTable } from "./modules/user/user.service";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server
    await server.start();

    // Simple GraphQL endpoint handler
    app.post("/graphql", async (req, res) => {
      try {
        const { query, variables, operationName } = req.body;
        const result = await server.executeOperation({
          query,
          variables,
          operationName,
        });
        res.json(result);
      } catch (err) {
        console.error("GraphQL error:", err);
        res.status(500).json({ errors: [{ message: String(err) }] });
      }
    });

    // Start Express server
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`REST API: http://localhost:${PORT}/api`);
      // create table automatically
      await createUserTable();
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();