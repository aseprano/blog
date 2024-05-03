import { InvalidTagException } from '../exceptions/InvalidTagException';

export class Tag {
  public constructor(private readonly tag: string) {
    this.checkIsValidTag(tag);
    this.tag = tag.toLowerCase();
  }

  private checkIsValidTag(tag: unknown): void {
    if (typeof tag !== 'string' || tag.match(/^[a-z0-9_]{1,30}$/i) === null) {
      throw new InvalidTagException();
    }
  }

  public asString(): string {
    return this.tag;
  }

  public toString(): string {
    return this.asString();
  }

  public equals(other: Tag): boolean {
    return other && (this === other || this.tag === other.tag);
  }
}
