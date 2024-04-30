import { PictureUrl } from '../../../../src/domain/value_objects/PictureUrl';
import { InvalidPictureUrlException } from '../../../../src/domain/exceptions/InvalidPictureUrlException';

describe('PictureUrl', () => {
  it.each([
    [undefined],
    [null],
    [123],
    [NaN],
    [''],
    ['ftp://user:password@myftp.com/path/to/image.jpg'],
    [['https://www.somesite.com/url.jpg']],
  ])('Cannot be built out of %p', (url: any) => {
    expect(() => new PictureUrl(url)).toThrow(InvalidPictureUrlException);
  });

  it.each([
    ['https://www.somesite.com/url.jpg'],
    ['http://www.somesite.com/url.jpg'],
    ['http://www.somesite.com/url.jpg?foo=bar&bar=baz'],
  ])('Can be built using some apparently correct value', (url: string) => {
    const pictureUrl = new PictureUrl(url);
    expect(pictureUrl.toString()).toEqual(url);
  });
});
