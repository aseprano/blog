import { Tag } from './Tag';
import { InvalidTagListException } from '../exceptions/InvalidTagListException';

export class TagList {
  private readonly tags: readonly Tag[];

  public constructor(tags: readonly string[]) {
    if (!Array.isArray(tags)) {
      throw new InvalidTagListException(`The tag list must be an array`);
    }

    try {
      this.tags = tags.map((tag) => new Tag(tag));
    } catch (exception: any) {
      throw new InvalidTagListException(`Invalid tag found in the list`);
    }

    if (this.tags.length < 1) {
      throw new InvalidTagListException(`The tag list must contain at least one tag`);
    }
  }

  public get items(): readonly Tag[] {
    return this.tags;
  }

  public get length(): number {
    return this.tags.length;
  }

  public toString(): string {
    return this.items.map((item) => `"${item.asString()}"`).join(', ');
  }
}
