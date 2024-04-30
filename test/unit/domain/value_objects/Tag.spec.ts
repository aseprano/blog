import { Tag } from '../../../../src/domain/value_objects/Tag';
import { InvalidTagException } from '../../../../src/domain/exceptions/InvalidTagException';

describe('Tag', () => {
  it.each([
    [undefined],
    [null],
    [NaN],
    [-1],
    [12],
    [''],
    [['reels']],
  ])('Cannot be built out of %p', (tag: any) => {
    expect(() => new Tag(tag)).toThrow(InvalidTagException);
  });

  it.each([
    ['reels'],
    ['a'],
    ['some_value'],
  ])('Can be built with a proper value: %p', (value) => {
    const tag = new Tag(value);
    expect(tag.asString()).toEqual(value);
  });
});
