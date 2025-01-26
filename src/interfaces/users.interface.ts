export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  email: string;
  name: string;
}

export interface UserGet {
  id: string;
  name: string;
}

export interface UserRepository {
  create(data: UserCreate): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<UserGet | null>;
  findAllUsers(): Promise<User[] | null>;
  deleteUser(email: string): Promise<User>;
  updateUserName(name: string, id: string): Promise<User>;
}
