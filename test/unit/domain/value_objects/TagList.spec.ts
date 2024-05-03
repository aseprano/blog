import { TagList } from '../../../../src/domain/value_objects/TagList';
import { InvalidTagListException } from '../../../../src/domain/exceptions/InvalidTagListException';
import { Tag } from '../../../../src/domain/value_objects/Tag';

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
    expect(() => TagList.parse(list)).toThrow(InvalidTagListException);
  });

  it.each([
    [['reels']],
    [['reels', 'gf', 'sanremo', 'einvece']],
  ])('Can be built with a list of valid strings: %p', (list) => {
    const tagList = TagList.parse(list);
    expect(tagList.length).toEqual(list.length);
    expect(tagList.items.map((tag) => tag.toString())).toEqual(list);
  });

  it('Makes the list of tags unique', () => {
    const tagList = TagList.parse(['foo', 'bar', 'baz', 'foo']);

    expect(tagList.items).toEqual([
      new Tag('foo'),
      new Tag('bar'),
      new Tag('baz'),
    ]);
  });

  it('Can create a new TagList with the union of tags', () => {
    const list1 = TagList.parse(['foo', 'bar']);
    const tagsToAdd = TagList.parse(['BaR', 'baZ']);
    const union = list1.append(tagsToAdd);

    expect(union.items).toEqual([
      new Tag('foo'),
      new Tag('bar'),
      new Tag('baz'),
    ]);

    expect(list1.items).toEqual([
      new Tag('foo'),
      new Tag('bar'),
    ]);
  });

  it('Can create a new TagList with the difference of tags', () => {
    const list1 = TagList.parse(['foo', 'bar', 'baz']);
    const tagsToRemove = TagList.parse(['BaR', 'bam']);
    const diff = list1.remove(tagsToRemove);

    expect(diff.items).toEqual([
      new Tag('foo'),
      new Tag('baz'),
    ]);

    expect(list1.items).toEqual([
      new Tag('foo'),
      new Tag('bar'),
      new Tag('baz'),
    ]);
  });

  it('Cannot remove all the tags', () => {
    const tags = TagList.parse(['foo', 'bar']);

    expect(() => tags.remove(TagList.parse(['bar', 'foo']))).toThrow(
      InvalidTagListException,
    );
  });
});
