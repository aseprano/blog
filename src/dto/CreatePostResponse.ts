import { ApiResponseProperty } from '@nestjs/swagger';

export class CreatePostResponse {
  @ApiResponseProperty()
  public readonly id: number;
}
