import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly label: string;
}

export class FullBlogPostResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly picture_url: string;

  @ApiProperty()
  readonly category: Category;

  @ApiProperty()
  readonly tags: readonly string[];
}
