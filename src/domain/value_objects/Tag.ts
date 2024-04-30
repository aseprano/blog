import { InvalidTagException } from '../exceptions/InvalidTagException';

export class Tag {
  public constructor(private readonly tag: string) {
    this.checkIsValidTag(tag);
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
}
