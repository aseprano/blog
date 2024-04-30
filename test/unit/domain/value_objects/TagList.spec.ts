import { TagList } from '../../../../src/domain/value_objects/TagList';
import { InvalidTagListException } from '../../../../src/domain/exceptions/InvalidTagListException';

describe('TagList', () => {
  it.each([
    [undefined],
    [null],
    [123],
    [NaN],
    ['some_tag'],
    [[123]],
    [[]],
  ])('Cannot be built out of %p', (list) => {
    // @ts-ignore
    expect(() => new TagList(list)).toThrow(InvalidTagListException);
  });

  it.each([
    [['reels']],
    [['reels', 'gf', 'sanremo', 'einvece']],
  ])('Can be built with a list of valid strings: %p', (list) => {
    const tagList = new TagList(list);
    expect(tagList.length).toEqual(list.length);
    expect(tagList.items.map((tag) => tag.toString())).toEqual(list);
  });
});
