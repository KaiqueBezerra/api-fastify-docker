import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { UserCreate } from "../interfaces/users.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();
  // fastify.addHook("preHandler", authMiddleware);
  fastify.post<{ Body: UserCreate }>("/", async (request, reply) => {
    const { name, email } = request.body;

    try {
      const data = await userUseCase.create({ name, email });
      return reply.status(201).send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });

  fastify.get<{ Params: { email: string } }>(
    "/:email",
    async (request, reply) => {
      const { email } = request.params;

      try {
        const data = await userUseCase.findUserByEmail(email);
        return reply.status(200).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.get("/", async (request, reply) => {
    try {
      const data = await userUseCase.findAllUsers();
      return reply.status(200).send(data);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });

  fastify.delete(
    "/",
    { preHandler: authMiddleware }, // Aqui é onde aplicamos o middleware
    async (request, reply) => {
      const userEmail = request.headers["email"] as string;
      const user = await userUseCase.findUserByEmail(userEmail);

      if (user !== null) {
        try {
          const data = await userUseCase.deleteUser(user.email);
          return reply.status(200).send(data);
        } catch (error) {
          return reply.status(500).send(error);
        }
      }
    }
  );
}
