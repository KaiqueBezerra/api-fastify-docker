import { prisma } from "../database/prisma-client";
import {
  User,
  UserCreate,
  UserRepository,
} from "../interfaces/users.interface";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const result = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return result;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: { email },
    });

    return result || null;
  }

  async findAllUsers(): Promise<User[] | null> {
    const result = await prisma.user.findMany();

    return result || null;
  }

  async deleteUser(id: string): Promise<User> {
    const result = await prisma.user.delete({ where: { id } });

    return result;
  }
}

export { UserRepositoryPrisma };
