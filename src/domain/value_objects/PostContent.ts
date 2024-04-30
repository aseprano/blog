import { InvalidPostContentException } from '../exceptions/InvalidPostContentException';

export class PostContent {
  static readonly MAX_ALLOWED_CONTENT_SIZE = 1024;

  public constructor(private readonly content: string) {
    this.checkContentIsValid(content);
  }

  public checkContentIsValid(content: unknown): void {
    if (typeof content !== 'string') {
      throw new InvalidPostContentException(`Post content must be a string`);
    } else if (content.length > PostContent.MAX_ALLOWED_CONTENT_SIZE) {
      throw new InvalidPostContentException(`Post content too big (max size is: ${PostContent.MAX_ALLOWED_CONTENT_SIZE})`);
    }
  }

  public toString(): string {
    return this.content;
  }

  public asString(): string {
    return this.toString();
  }
}
