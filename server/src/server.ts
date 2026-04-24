import app from "./app";
import { createCategoryTable } from "./modules/category/category.service.js";
import { createOrderTable } from "./modules/order/order.service.js";
import { createUserTable } from "./modules/user/user.service";
import { createProductTable } from "./modules/products/product.service";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { env } from "./config/env.js";
import { authMiddleware } from "./middleware/auth.middleware";
import { loggerMiddleware } from "./middleware/logger";

const PORT = env.port;

app.use(loggerMiddleware);

const logDatabaseStartupError = (error: unknown) => {
  const pgError = error as { code?: string; message?: string };
  console.error("Database initialization failed.");
  if (pgError?.code === "28P01") {
    console.error(`Postgres rejected the login for user "${env.dbUser}" on ${env.dbHost}:${env.dbPort}/${env.dbName}.`);
    return;
  }
  console.error(pgError?.message ?? error);
};

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (formattedError, error) => {
        // Return a sanitized error message
        console.error("GraphQL Error:", error);
        return {
          message: formattedError.message,
          path: formattedError.path,
          extensions: {
            code: formattedError.extensions?.code,
          },
        };
      },
    });

    await server.start();

    // Use standard Apollo Express middleware
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const user = authMiddleware(req);
          return { user };
        },
      })
    );

    app.listen(PORT, async () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      
      try {
        await createCategoryTable();
        await createUserTable();
        await createProductTable();
        await createOrderTable();
        console.log("✅ Database initialized successfully");
      } catch (error) {
        logDatabaseStartupError(error);
      }
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
