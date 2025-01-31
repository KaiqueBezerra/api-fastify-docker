import { prisma } from "../database/prisma-client";
import {
  Post,
  PostCreate,
  PostRepository,
  PostUpdate,
} from "../interfaces/posts.interface";

class PostRepositoryPrisma implements PostRepository {
  async create(data: PostCreate): Promise<Post> {
    const result = await prisma.posts.create({
      data: {
        title: data.title,
        body: data.body,
        authorId: data.authorId,
      },
    });

    return result;
  }

  async findPostsByUser(id: string): Promise<Post[] | null> {
    const result = await prisma.posts.findMany({
      where: { authorId: id },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return result || null;
  }

  async findPostById(id: string): Promise<Post | null> {
    const result = await prisma.posts.findFirst({
      where: { id },
      include: { author: true },
    });

    return result || null;
  }

  async findAllPosts(): Promise<Post[] | null> {
    const result = await prisma.posts.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return result || null;
  }

  async deletePost(id: string): Promise<Post> {
    const result = await prisma.posts.delete({ where: { id } });

    return result;
  }

  async updatePost({ title, body, id }: PostUpdate): Promise<Post> {
    const result = await prisma.posts.update({
      where: { id },
      data: { title, body },
    });

    return result;
  }
}

export { PostRepositoryPrisma };
