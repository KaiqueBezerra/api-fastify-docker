import fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user.routes";
import { postRoutes } from "./routes/post.routes";

const app: FastifyInstance = fastify({
  logger: true,
});

app.register(userRoutes, { prefix: "/users" });
app.register(postRoutes, { prefix: "/posts" });

app.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log("Server running on port 3000");
});
