import { CategoryId } from '../../../../src/domain/value_objects/CategoryId';
import { InvalidCategoryIdException } from '../../../../src/domain/exceptions/InvalidCategoryIdException';

describe('CategoryId', () => {
  it.each([
    [undefined],
    [null],
    [NaN],
    [3.14],
    [-3],
    ['1'],
    [true],
    [Number.POSITIVE_INFINITY],
    [0],
    [[123]],
  ])('Cannot be built out of %p', (id: any) => {
    expect(() => new CategoryId(id)).toThrow(InvalidCategoryIdException);
  });

  it('Can be built using an acceptable value', () => {
    const categoryId = new CategoryId(101);
    expect(categoryId.asNumber()).toEqual(101);
  });
});
