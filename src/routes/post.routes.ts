import { FastifyInstance } from "fastify";
import { PostUseCase } from "../usecases/post.usecase";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserUseCase } from "../usecases/user.usecase";

export async function postRoutes(fastify: FastifyInstance) {
  const postUseCase = new PostUseCase();
  const userUseCase = new UserUseCase();

  fastify.post<{ Body: { title: string; body: string; authorId: string } }>(
    "/",
    { preHandler: authMiddleware }, // Aqui é onde aplicamos o middleware
    async (request, reply) => {
      const { title, body } = request.body;
      const email = request.headers["email"] as string;
      const user = await userUseCase.findUserByEmail(email);

      if (user !== null) {
        try {
          const data = await postUseCase.create(user.email, {
            title,
            body,
            authorId: user.id,
          });
          return reply.status(201).send(data);
        } catch (error) {
          return reply.status(500).send(error);
        }
      }
    }
  );

  fastify.get<{ Params: { email: string } }>(
    "/:email",
    async (request, reply) => {
      const { email } = request.params;
      const user = await userUseCase.findUserByEmail(email);

      if (user !== null) {
        try {
          const data = await postUseCase.findPostsByUser(user.email);
          return reply.status(200).send(data);
        } catch (error) {
          return reply.status(500).send(error);
        }
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/post/:id",
    async (request, reply) => {
      const { id } = request.params;

      try {
        const data = await postUseCase.findPostById(id);
        return reply.status(200).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.get("/", async (request, reply) => {
    try {
      const data = await postUseCase.findAllPosts();
      return reply.status(200).send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authMiddleware }, // Aqui é onde aplicamos o middleware
    async (request, reply) => {
      const { id } = request.params;
      const email = request.headers["email"] as string;
      const user = await userUseCase.findUserByEmail(email);
      const post = await postUseCase.findPostById(id);

      if (post?.authorId === user?.id) {
        try {
          const data = await postUseCase.deletePost(id);
          return reply.status(200).send(data);
        } catch (error) {
          return reply.status(500).send(error);
        }
      } else {
        return reply.status(401).send("Not authorized");
      }
    }
  );
}
