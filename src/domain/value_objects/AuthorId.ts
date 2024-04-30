import { InvalidAuthorIdException } from '../exceptions/InvalidAuthorIdException';
import { AbstractId } from './AbstractId';

export class AuthorId extends AbstractId {
  protected checkIsValidId(id: unknown): void {
    if (!this.isValidNumericId(id)) {
      throw new InvalidAuthorIdException(`Invalid author id`);
    }
  }
}
