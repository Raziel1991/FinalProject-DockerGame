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

const port = Number(process.env.PORT) || 4000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

await connectToDatabase();
await apolloServer.start();

app.use(
  cors({
    origin: clientUrl,
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
