import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { UserCreate } from "../interfaces/users.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();
  // fastify.addHook("preHandler", authMiddleware);
  fastify.post<{ Body: UserCreate }>(
    "/",
    {
      schema: {
        description: "Create a new user.",
        tags: ["Users"],
        body: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        summary: "Create a new user.",
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;

      try {
        const data = await userUseCase.create({ name, email });
        return reply.status(201).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.get<{ Params: { email: string } }>(
    "/:email",
    {
      schema: {
        description: "Get user by email.",
        tags: ["Users"],
        summary: "Get user by email.",
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email } = request.params;

      try {
        const data = await userUseCase.findUserByEmail(email);

        if (!data) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply.status(200).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/user/:id",
    {
      schema: {
        description: "Get user by id.",
        tags: ["Users"],
        summary: "Get user by id.",
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const data = await userUseCase.findUserById(id);

        if (!data) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply.status(200).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.get(
    "/",
    {
      schema: {
        description: "Get all users.",
        tags: ["Users"],
        summary: "Get all users.",
        response: {
          200: {
            type: "array",
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const data = await userUseCase.findAllUsers();
        return reply.status(200).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.delete(
    "/",
    {
      preHandler: authMiddleware, // Middleware de autenticação
      schema: {
        description: "Delete user by email.",
        tags: ["Users"],
        summary: "Delete user by email.",
        headers: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              description: "user email",
            },
          },
        },
        response: {
          200: {
            description: "User deleted",
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
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
      } else {
        return reply.status(404).send({ message: "User not found" });
      }
    }
  );

  fastify.patch<{ Body: { name: string } }>(
    "/",
    {
      preHandler: authMiddleware,
      schema: {
        description: "Update user name.",
        tags: ["Users"],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
          },
        },
        summary: "Update user name.",
        headers: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              description: "user email",
            },
          },
        },
        response: {
          200: {
            description: "User deleted",
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },

    async (request, reply) => {
      const userEmail = request.headers["email"] as string;
      const user = await userUseCase.findUserByEmail(userEmail);
      const { name } = request.body;

      if (user !== null) {
        try {
          const data = await userUseCase.updateUserName(
            name,
            user.id,
            user.email
          );
          return reply.status(200).send(data);
        } catch (error) {
          return reply.status(500).send(error);
        }
      } else {
        return reply.status(404).send({ message: "User not found" });
      }
    }
  );
}
