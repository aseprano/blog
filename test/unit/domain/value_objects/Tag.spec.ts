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

  it('Converts the tag to lowercase', () => {
    const tag = new Tag('FooBar');
    expect(tag.asString()).toEqual('foobar');
  });

  it('Can check another tag for equality', () => {
    const t1 = new Tag('foo');
    const t2 = new Tag('Foo');
    const t3 = new Tag('Bar');

    expect(t1.equals(t1)).toBeTruthy();
    expect(t1.equals(t2)).toBeTruthy();
    expect(t1.equals(t3)).toBeFalsy();
  });
});
