import { FastifyInstance } from "fastify";
import { PostUseCase } from "../usecases/post.usecase";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserUseCase } from "../usecases/user.usecase";

export async function postRoutes(fastify: FastifyInstance) {
  const postUseCase = new PostUseCase();
  const userUseCase = new UserUseCase();

  fastify.post<{ Body: { title: string; body: string; authorId: string } }>(
    "/",
    {
      preHandler: authMiddleware,
      schema: {
        description: "Create a new post.",
        tags: ["Posts"],
        body: {
          type: "object",
          required: ["title", "body"],
          properties: {
            title: { type: "string" },
            body: { type: "string" },
          },
        },
        summary: "Create a new post.",
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
          201: {
            description: "Post created successfully.",
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              body: { type: "string" },
              authorId: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            description: "User not found.",
            type: "object",
            properties: {
              error: { type: "string" },
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
    }, // Aqui é onde aplicamos o middleware
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
      } else {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }
    }
  );

  fastify.get<{ Params: { email: string } }>(
    "/:email",
    {
      schema: {
        description: "Get all posts by user.",
        tags: ["Posts"],
        summary: "Get all posts by user.",
        params: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "User email",
            },
          },
          required: ["email"],
        },
        response: {
          200: {
            description: "All posts by user.",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                body: { type: "string" },
                authorId: { type: "string" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
          404: {
            description: "User not found.",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            description: "Internal server error.",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
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
      } else {
        return reply.status(404).send({ error: "Usuário não encontrado" });
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/post/:id",
    {
      schema: {
        description: "Get post by id.",
        tags: ["Posts"],
        summary: "Get post by id.",
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Post id",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Post by id.",
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              body: { type: "string" },
              authorId: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            description: "Post not found.",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            description: "Internal server error.",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const data = await postUseCase.findPostById(id);

        if (data === null) {
          return reply.status(404).send({ error: "Post not found" });
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
        description: "Get all posts.",
        tags: ["Posts"],
        summary: "Get all posts.",
        response: {
          200: {
            type: "array",
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                body: { type: "string" },
                authorId: { type: "string" },
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
        const data = await postUseCase.findAllPosts();
        return reply.status(200).send(data);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: authMiddleware,
      schema: {
        description: "Delete post by id.",
        tags: ["Posts"],
        summary: "Delete post by id.",
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Post id",
            },
          },
          required: ["id"],
        },
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
            description: "Post deleted.",
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              body: { type: "string" },
              authorId: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
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
    }, // Aqui é onde aplicamos o middleware
    async (request, reply) => {
      const { id } = request.params;
      const email = request.headers["email"] as string;
      const user = await userUseCase.findUserByEmail(email);
      const post = await postUseCase.findPostById(id);

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      if (!post) {
        return reply.status(404).send({ error: "Post not found" });
      }

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

  fastify.patch<{
    Params: { id: string };
    Body: { title: string; body: string };
  }>(
    "/:id",
    {
      preHandler: authMiddleware,
      schema: {
        description: "Update post by id.",
        tags: ["Posts"],
        body: {
          type: "object",
          required: ["title", "body"],
          properties: {
            title: { type: "string" },
            body: { type: "string" },
          },
        },
        summary: "Update post by id.",
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Post id",
            },
          },
          required: ["id"],
        },
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
            description: "Post updated.",
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              body: { type: "string" },
              authorId: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
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
      const { id } = request.params;
      const { title, body } = request.body;
      const email = request.headers["email"] as string;
      const user = await userUseCase.findUserByEmail(email);
      const post = await postUseCase.findPostById(id);

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      if (!post) {
        return reply.status(404).send({ error: "Post not found" });
      }

      if (post?.authorId === user?.id) {
        try {
          const data = await postUseCase.updatePost({ id, title, body });
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
