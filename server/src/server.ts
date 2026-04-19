import app from "./app";
import { createCategoryTable } from "./modules/category/category.service.js";
import { createUserTable } from "./modules/user/user.service";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { env } from "./config/env.js";

const PORT = env.port;

const logDatabaseStartupError = (error: unknown) => {
  const pgError = error as { code?: string; message?: string };

  console.error("Database initialization failed.");

  if (pgError?.code === "28P01") {
    console.error(
      `Postgres rejected the login for user "${env.dbUser}" on ${env.dbHost}:${env.dbPort}/${env.dbName}.`
    );
    console.error(
      "Update DB_USER, DB_PASSWORD, and DB_NAME in server/.env to match your local PostgreSQL setup."
    );
    return;
  }

  console.error(pgError?.message ?? error);
};

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
      console.log(`REST API: http://localhost:${PORT}/api/users`);

      try {
        await createCategoryTable();
        await createUserTable();
        console.log("Database connection established");
      } catch (error) {
        logDatabaseStartupError(error);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
