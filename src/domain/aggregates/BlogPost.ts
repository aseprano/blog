import { PostId } from '../value_objects/PostId';
import { BlogPostProperties } from '../app_services/PostsManagementService';
import { PostTitle } from '../value_objects/PostTitle';
import { PostContent } from '../value_objects/PostContent';
import { PictureUrl } from '../value_objects/PictureUrl';
import { CategoryId } from '../value_objects/CategoryId';
import { TagList } from '../value_objects/TagList';
import { InvalidTagListException } from '../exceptions/InvalidTagListException';
import { InvalidNumberOfTagsException } from '../exceptions/InvalidNumberOfTagsException';

export class BlogPost {
  public constructor(
    private readonly id?: PostId,
    private readonly properties?: BlogPostProperties,
    private readonly version = 0,
  ) {}

  public get Id(): PostId {
    return this.id;
  }

  public get Version(): number {
    return this.version;
  }

  public get Title(): PostTitle {
    return this.properties.title;
  }

  public get Content(): PostContent {
    return this.properties.content;
  }

  public get PictureUrl(): PictureUrl {
    return this.properties.pictureUrl;
  }

  public get Category(): CategoryId {
    return this.properties.category;
  }

  public get TagList(): TagList {
    return this.properties.tags;
  }

  public updateProperties(newContent: Partial<BlogPostProperties>): void {
    for (const property of Object.keys(newContent)) {
      const newValue = newContent[property];

      if (!newValue) {
        continue;
      }

      this.properties[property] = newValue;
    }
  }

  public addTags(newTags: TagList): void {
    this.properties.tags = this.properties.tags.append(newTags);
  }

  /**
   * Removes a list of tas from the post
   *
   * @throws InvalidNumberOfTagsException if the request removes all the tags
   */
  public removeTags(tags: TagList): void {
    try {
      this.properties.tags = this.properties.tags.remove(tags);
    } catch (error: any) {
      if (error instanceof InvalidTagListException) {
        throw new InvalidNumberOfTagsException();
      }

      throw error;
    }
  }
}
