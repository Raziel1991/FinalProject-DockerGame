import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { connectToDatabase } from "./config/db.js";
import healthRouter from "./routes/health.routes.js";
import { buildContext } from "./graphql/context.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/schema/index.js";
import { ensureDevDemoUser } from "./utils/ensureDevDemoUser.js";
import { ensureDevPresentationData } from "./utils/ensureDevPresentationData.js";

const port = Number(process.env.PORT) || 4000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = new Set([
  clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
]);

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

await apolloServer.start();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use("/health", healthRouter);
app.use(
  "/graphql",
  expressMiddleware(apolloServer, {
    context: async ({ req }) => buildContext(req)
  })
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`GraphQL ready at http://localhost:${port}/graphql`);
});

async function initializeDatabase() {
  try {
    await connectToDatabase();
    await ensureDevDemoUser();
    await ensureDevPresentationData();
  } catch (error) {
    console.error("Database initialization failed.", error);
  }
}

initializeDatabase();
