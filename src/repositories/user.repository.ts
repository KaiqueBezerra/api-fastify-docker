import { prisma } from "../database/prisma-client";
import {
  User,
  UserCreate,
  UserGet,
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

  async findUserById(id: string): Promise<UserGet | null> {
    const result = await prisma.user.findFirst({
      where: { id },
      select: { id: true, name: true },
    });

    return result || null;
  }

  async findAllUsers(): Promise<User[] | null> {
    const result = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return result || null;
  }

  async deleteUser(id: string): Promise<User> {
    const result = await prisma.user.delete({ where: { id } });

    return result;
  }

  async updateUserName(name: string, id: string): Promise<User> {
    const result = await prisma.user.update({ where: { id }, data: { name } });

    return result;
  }
}

export { UserRepositoryPrisma };
