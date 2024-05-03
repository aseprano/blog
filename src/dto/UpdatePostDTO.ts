import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDTO {
  @ApiPropertyOptional()
  public readonly title?: string;

  @ApiPropertyOptional()
  public readonly content?: string;

  @ApiPropertyOptional()
  public readonly picture_url?: string;

  @ApiPropertyOptional()
  public readonly id_category?: number;

  @ApiPropertyOptional()
  public readonly tags?: readonly string[];
}
