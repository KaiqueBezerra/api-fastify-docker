import fastify, { FastifyInstance } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { userRoutes } from "./routes/user.routes";
import { postRoutes } from "./routes/post.routes";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

const app: FastifyInstance = fastify({
  logger: true,
});

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "My Node API",
      version: "1.0.0",
    },
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecification: (swaggerObject) => swaggerObject,
});

app.register(userRoutes, { prefix: "/users" });
app.register(postRoutes, { prefix: "/posts" });

app.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log("Server running on port 3000");
  console.log("Documentação disponível em http://localhost:3000/docs");
});
