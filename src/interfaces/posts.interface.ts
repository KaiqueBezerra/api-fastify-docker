export interface Post {
  id: String;
  title: String;
  body: String;
  authorId: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostCreate {
  title: string;
  body: string;
  authorId: string;
}

export interface PostUpdate {
  title: string;
  body: string;
  id: string;
}

export interface PostRepository {
  create(data: PostCreate): Promise<Post>;
  findPostsByUser(id: string): Promise<Post[] | null>;
  findPostById(id: string): Promise<Post | null>;
  findAllPosts(): Promise<Post[] | null>;
  deletePost(email: string): Promise<Post>;
  updatePost(data: PostUpdate): Promise<Post>
}
