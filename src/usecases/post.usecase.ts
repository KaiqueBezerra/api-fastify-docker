import {
  Post,
  PostCreate,
  PostRepository,
  PostUpdate,
} from "../interfaces/posts.interface";
import { UserRepository } from "../interfaces/users.interface";
import { PostRepositoryPrisma } from "../repositories/post.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class PostUseCase {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepositoryPrisma();
    this.userRepository = new UserRepositoryPrisma();
  }

  async create(
    email: string,
    { title, body, authorId }: PostCreate
  ): Promise<Post> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("User not exists");
    }

    const result = await this.postRepository.create({ title, body, authorId });

    return result;
  }

  async findPostsByUser(email: string): Promise<Post[] | null> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("User not exists");
    }

    const result = await this.postRepository.findPostsByUser(user.id);

    return result || null;
  }

  async findPostById(id: string): Promise<Post | null> {
    const result = await this.postRepository.findPostById(id);

    return result || null;
  }

  async findAllPosts(): Promise<Post[] | null> {
    const result = await this.postRepository.findAllPosts();

    return result || null;
  }

  async deletePost(id: string): Promise<Post> {
    const result = await this.postRepository.deletePost(id);

    return result || null;
  }

  async updatePost({ id, title, body }: PostUpdate): Promise<Post> {
    const result = await this.postRepository.updatePost({ id, title, body });

    return result || null;
  }
}

export { PostUseCase };
