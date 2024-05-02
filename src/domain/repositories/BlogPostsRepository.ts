import { PostId } from '../value_objects/PostId';
import { BlogPost } from '../aggregates/BlogPost';

export interface BlogPostsRepository {
  /**
   * Retrieves a blog post by its id
   * @throws BlogPostNotFoundException
   */
  getById(id: PostId): Promise<BlogPost>;

  /**
   * Saves a new blog post and returns its new id
   */
  add(post: BlogPost): Promise<PostId>;

  /**
   * @throws BlogPostNotFoundException
   * @throws VersionMismatchException
   */
  update(post: BlogPost): Promise<void>;

  /**
   * @throws BlogPostNotFoundException
   */
  delete(id: PostId): Promise<void>;
}
