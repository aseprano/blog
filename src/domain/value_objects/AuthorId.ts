import { InvalidAuthorIdException } from '../exceptions/InvalidAuthorIdException';

export class AuthorId {
  public constructor(private readonly id: number) {
    this.checkIsValidAuthorId(id);
  }

  private checkIsValidAuthorId(id: unknown): void {
    if (typeof id !== 'number' || !Number.isInteger(id) || id < 1) {
      throw new InvalidAuthorIdException(`Invalid author id`);
    }
  }

  public asNumber(): number {
    return this.id;
  }

  public toString(): string {
    return `${this.asNumber()}`;
  }
}
