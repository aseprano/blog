import { PostTitle } from '../../../../src/domain/value_objects/PostTitle';
import { InvalidPostTitleException } from '../../../../src/domain/exceptions/InvalidPostTitleException';

describe('PostTitle', () => {
  it.each([
    [123],
    [undefined],
    [['hello']],
    [NaN],
    [null],
    [""],
  ])('Cannot be built out of %p', (title: any) => {
    expect(() => new PostTitle(title)).toThrow(InvalidPostTitleException);
  });

  it('Can be built out of a non-empty string', () => {
    const title = new PostTitle('This is some test title');
    expect(title.asString()).toEqual('This is some test title');
  });
});
