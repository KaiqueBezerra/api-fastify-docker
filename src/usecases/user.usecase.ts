import {
  User,
  UserCreate,
  UserGet,
  UserRepository,
} from "../interfaces/users.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }

  async create({ name, email }: UserCreate): Promise<User> {
    const userVeriryExists = await this.userRepository.findUserByEmail(email);

    if (userVeriryExists) {
      throw new Error("User already exists");
    }

    const result = await this.userRepository.create({ name, email });

    return result;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.userRepository.findUserByEmail(email);

    return result || null;
  }

  async findUserById(id: string): Promise<UserGet | null> {
    const result = await this.userRepository.findUserById(id);

    return result || null;
  }

  async findAllUsers(): Promise<User[] | null> {
    const result = await this.userRepository.findAllUsers();

    return result || null;
  }

  async deleteUser(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("User not exists");
    }

    const result = await this.userRepository.deleteUser(user.id);

    return result || null;
  }

  async updateUserName(name: string, id: string, email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("User not exists");
    }

    const result = await this.userRepository.updateUserName(name, id);

    return result || null;
  }
}

export { UserUseCase };
