import { InvalidPictureUrlException } from '../exceptions/InvalidPictureUrlException';

export class PictureUrl {
  public constructor(private readonly url: string) {
    this.checkIsValidUrl(url);
  }

  public checkIsValidUrl(url: unknown): void {
    if (typeof url !== 'string' || url.match(/^https?:\/\/.+$/i) === null) {
      throw new InvalidPictureUrlException(`The picture's url does is not valid`);
    }
  }

  public asString(): string {
    return this.url;
  }

  public toString(): string {
    return this.asString();
  }
}
