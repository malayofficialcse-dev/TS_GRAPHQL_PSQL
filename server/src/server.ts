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
import { ZodError } from "zod";

const PORT = env.port;

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (formattedError, error) => {
        if (error instanceof Error && (error as any).originalError instanceof ZodError) {
          const zodError = (error as any).originalError as ZodError;
          return {
            ...formattedError,
            message: "Validation Failed",
            extensions: {
              code: "BAD_USER_INPUT",
              errors: zodError.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            }
          };
        }
        return formattedError;
      },
    });

    await server.start();

    // Use standard Apollo 4 middleware
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
        console.log("✅ Database initialized");
      } catch (error) {
        console.error("❌ Database initialization failed:", error);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
