import { PostContent } from '../../../../src/domain/value_objects/PostContent';
import { InvalidPostContentException } from '../../../../src/domain/exceptions/InvalidPostContentException';

describe(`PostContent`, () => {
  it.each([
    [123],
    [null],
    [undefined],
    [NaN],
    [['Lorem ipsum dolor sit amet']],
  ])('Cannot be built out of %p', (content: any) => {
    expect(() => new PostContent(content)).toThrow(new InvalidPostContentException('Post content must be a string'));
  });

  it('Cannot be built with a content too big', () => {
    const valueTooBig = ' '.repeat(1025);
    expect(() => new PostContent(valueTooBig)).toThrow(new InvalidPostContentException(`Post content too big (max size is: ${PostContent.MAX_ALLOWED_CONTENT_SIZE})`));
  });

  it.each([
    [''],
    ['This is so lame'],
    [' '.repeat(1024)],
  ])('Can be built with a proper value', (s) => {
    const content = new PostContent(s);
    expect(content.toString()).toEqual(s);
  });
});
