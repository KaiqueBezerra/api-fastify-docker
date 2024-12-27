import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiEmail = request.headers["email"];

  if (!apiEmail) {
    reply.status(401).send({
      message: "Email is required",
    });
  }
}
