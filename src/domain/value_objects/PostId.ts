import { AbstractId } from './AbstractId';
import { InvalidPostIdException } from '../exceptions/InvalidPostIdException';

export class PostId extends AbstractId {
  protected checkIsValidId(id: unknown) {
    if (!this.isValidNumericId(id)) {
      throw new InvalidPostIdException();
    }
  }
}
