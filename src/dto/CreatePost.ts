import { ApiProperty } from '@nestjs/swagger';

export class CreatePost {
  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly content: string;

  @ApiProperty()
  public readonly picture_url: string;

  @ApiProperty()
  public readonly id_category: number;

  @ApiProperty()
  public readonly tags: readonly string[];
}
