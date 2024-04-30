import { AuthorId } from '../../../../src/domain/value_objects/AuthorId';
import { InvalidAuthorIdException } from '../../../../src/domain/exceptions/InvalidAuthorIdException';

describe('AuthorId', () => {
  it.each([
    [undefined],
    [null],
    [NaN],
    [3.14],
    [-3],
    ['1'],
    [true],
    [[123]],
  ])('Cannot be built out of %p', (id: any) => {
    expect(() => new AuthorId(id)).toThrow(InvalidAuthorIdException);
  });

  it('Can be built using an acceptable value', () => {
    const authorId = new AuthorId(101);
    expect(authorId.asNumber()).toEqual(101);
  });
});
