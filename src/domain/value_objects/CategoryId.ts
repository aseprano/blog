import { AbstractId } from './AbstractId';
import { InvalidCategoryIdException } from '../exceptions/InvalidCategoryIdException';

export class CategoryId extends AbstractId {
  protected checkIsValidId(id: unknown): void {
    if (!this.isValidNumericId(id)) {
      throw new InvalidCategoryIdException(`Category id is not a valid id`);
    }
  }
}
