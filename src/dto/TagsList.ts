import { ApiProperty } from '@nestjs/swagger';

export class TagsList {
  @ApiProperty()
  readonly tags: readonly string[];
}
