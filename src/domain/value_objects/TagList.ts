import { Tag } from './Tag';
import { InvalidTagListException } from '../exceptions/InvalidTagListException';

export class TagList {
  public static parse(strings: readonly string[]): TagList {
    if (!Array.isArray(strings)) {
      throw new InvalidTagListException(`The tag list must be an array`);
    }

    try {
      const tags = strings.map((s) => new Tag(s));
      return new TagList(tags);
    } catch (exception: any) {
      throw new InvalidTagListException(`Invalid tag found in the list`);
    }
  }

  private constructor(private readonly tags: readonly Tag[]) {
    if (this.tags.length < 1) {
      throw new InvalidTagListException(
        `The tag list must contain at least one tag`,
      );
    }

    this.tags = tags.filter(
      (tag, index) => tags.findIndex((item) => item.equals(tag)) === index,
    );
  }

  public get items(): readonly Tag[] {
    return this.tags;
  }

  public append(tagsToAdd: TagList): TagList {
    return new TagList(this.tags.concat(tagsToAdd.items));
  }

  public remove(tagsToRemove: TagList): TagList {
    const diff: Tag[] = [...this.tags];

    tagsToRemove.items.forEach((tag) => {
      const index = diff.findIndex((item) => item.equals(tag));

      if (index >= 0) {
        diff.splice(index, 1);
      }
    });

    return new TagList(diff);
  }

  public get length(): number {
    return this.tags.length;
  }

  public toString(): string {
    return this.items.map((item) => `"${item.asString()}"`).join(', ');
  }
}
