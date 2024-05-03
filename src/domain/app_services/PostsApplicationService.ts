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
  title: PostTitle;
  content: PostContent;
  pictureUrl: PictureUrl;
  category: CategoryId;
  tags: TagList;
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

export interface AlterTagsCommand {
  readonly id: PostId;
  readonly tags: TagList;
}

export class PostsApplicationService {
  private MAX_RETRIES = 3;

  public constructor(private readonly repository: BlogPostsRepository) {}

  private async wait(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  /**
   * Loads a post, provides a callback mechanism to update its content and
   * tries to store the changes.
   * Encapsulates the optimistic-lock retry mechanism
   *
   * @param id The id of the post to edit
   * @param callback The callback that uses the post to perform changes
   *
   * @throws ConcurrentUpdatesException
   */
  private async performOnPost(
    id: PostId,
    callback: (post: BlogPost) => Promise<void>,
  ): Promise<void> {
    let attempts = 1;

    do {
      const post = await this.repository.getById(id);
      await callback(post);

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
    return this.performOnPost(command.id, async (post) =>
      post.updateProperties(command.properties),
    );
  }

  /**
   * Adds a list of tags to a post
   *
   * @throws BlogPostNotFoundException
   * @throws ConcurrentUpdatesException
   */
  public async addTags(command: AlterTagsCommand): Promise<void> {
    return this.performOnPost(command.id, async (post) =>
      post.addTags(command.tags),
    );
  }

  /**
   * Removes a list of tags from a post
   *
   * @throws BlogPostNotFoundException
   * @throws InvalidNumberOfTagsException if all the tags have been removed from the post
   * @throws ConcurrentUpdatesException
   */
  public async removeTags(command: AlterTagsCommand): Promise<void> {
    return this.performOnPost(command.id, async (post) =>
      post.removeTags(command.tags),
    );
  }

  /**
   * @throws BlogPostNotFoundException
   */
  public async delete(command: DeleteBlogPostCommand): Promise<void> {
    return this.repository.delete(command.id);
  }
}
