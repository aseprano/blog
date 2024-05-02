import { PostTitle } from '../value_objects/PostTitle';
import { PostContent } from '../value_objects/PostContent';
import { PictureUrl } from '../value_objects/PictureUrl';
import { CategoryId } from '../value_objects/CategoryId';
import { TagList } from '../value_objects/TagList';
import { PostId } from '../value_objects/PostId';
import { BlogPostsRepository } from '../repositories/BlogPostsRepository';
import { BlogPost } from '../aggregates/BlogPost';
import { VersionMismatchException } from '../exceptions/VersionMismatchException';
import { ConcurrentUpdatesException } from '../exceptions/ConcurrentUpdatesException';

export interface BlogPostProperties {
  readonly title: PostTitle;
  readonly content: PostContent;
  readonly pictureUrl: PictureUrl;
  readonly category: CategoryId;
  readonly tags: TagList;
}

export interface CreateBlogPostCommand {
  readonly properties: BlogPostProperties;
}

export interface UpdateBlogPostCommand {
  readonly id: PostId;
  readonly properties: Partial<BlogPostProperties>;
}

export interface DeleteBlogPostCommand {
  readonly id: PostId;
}

export class PostsApplicationService {
  private MAX_RETRIES = 3;

  public constructor(private readonly repository: BlogPostsRepository) {}

  private async wait(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  /**
   * Creates a new blog post and returns its new id
   */
  public async create(command: CreateBlogPostCommand): Promise<PostId> {
    const post = new BlogPost(undefined, command.properties);
    return this.repository.add(post);
  }

  /**
   * Updates a blog post with some - even partial - new properties
   *
   * @throws BlogPostNotFoundException
   * @throws ConcurrentUpdatesException
   */
  public async update(command: UpdateBlogPostCommand): Promise<void> {
    let attempts = 1;

    do {
      const post = await this.repository.getById(command.id);

      post.updateProperties(command.properties);

      try {
        return await this.repository.update(post);
      } catch (exception: any) {
        if (!(exception instanceof VersionMismatchException)) {
          throw exception;
        } else if (attempts >= this.MAX_RETRIES) {
          throw new ConcurrentUpdatesException();
        }

        ++attempts;
        await this.wait(100);
      }
    } while (true);
  }

  public async delete(command: DeleteBlogPostCommand): Promise<void> {
    return this.repository.delete(command.id);
  }
}
