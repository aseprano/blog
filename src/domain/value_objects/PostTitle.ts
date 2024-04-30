import { InvalidPostTitleException } from '../exceptions/InvalidPostTitleException';

export class PostTitle {
  public constructor(private readonly title: string) {
    if (!this.isValidTitle(title)) {
      throw new InvalidPostTitleException();
    }
  }

  private isValidTitle(title: unknown): boolean {
    return typeof title === 'string' && title !== '';
  }

  public asString(): string {
    return this.title;
  }

  public toString(): string {
    return this.asString();
  }
}
