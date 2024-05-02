import {
  Controller,
  UseGuards,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PostsApplicationService } from '../domain/app_services/PostsApplicationService';
import { PostTitle } from '../domain/value_objects/PostTitle';
import { PostContent } from '../domain/value_objects/PostContent';
import { PictureUrl } from '../domain/value_objects/PictureUrl';
import { CategoryId } from '../domain/value_objects/CategoryId';
import { TagList } from '../domain/value_objects/TagList';
import { InvalidPostTitleException } from '../domain/exceptions/InvalidPostTitleException';
import { InvalidPostContentException } from '../domain/exceptions/InvalidPostContentException';
import { InvalidPictureUrlException } from '../domain/exceptions/InvalidPictureUrlException';
import { InvalidCategoryIdException } from '../domain/exceptions/InvalidCategoryIdException';
import { InvalidTagListException } from '../domain/exceptions/InvalidTagListException';
import { PostId } from '../domain/value_objects/PostId';
import { BlogPostNotFoundException } from '../domain/exceptions/BlogPostNotFoundException';
import { ConcurrentUpdatesException } from '../domain/exceptions/ConcurrentUpdatesException';
import { RolesGuard } from '../roles/roles.guard';
import { AllowedRoles } from '../guards/roles.decorator';
import * as Roles from '../guards/roles.decorator';

@Controller('posts')
@UseGuards(RolesGuard)
export class PostsController {
  public constructor(
    private readonly posts: PostsApplicationService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(@Body() body: any): Promise<any> {
    console.log(body);

    try {
      const newId = await this.posts.create({
        properties: {
          title: new PostTitle(body.title),
          content: new PostContent(body.content),
          pictureUrl: new PictureUrl(body.picture_url),
          category: new CategoryId(body.id_category),
          tags: new TagList(body.tags),
        },
      });

      return {
        id: newId.asNumber(),
      };
    } catch (error: any) {
      this.logger.error(error);

      if (error instanceof InvalidPostTitleException) {
        throw new HttpException('Missing or invalid title', 400);
      } else if (error instanceof InvalidPostContentException) {
        throw new HttpException(error.message, 400);
      } else if (error instanceof InvalidPictureUrlException) {
        throw new HttpException(error.message, 400);
      } else if (error instanceof InvalidCategoryIdException) {
        throw new HttpException(error.message, 400);
      } else if (error instanceof InvalidTagListException) {
        throw new HttpException(error.message, 400);
      }

      throw error;
    }
  }

  @Put('/:id(\\d+)')
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<void> {
    this.logger.log(`Wanna update post ${id}`);

    try {
      await this.posts.update({
        id: new PostId(Number(id)),
        properties: {
          title: body.title ? new PostTitle(body.title) : undefined,
          content: body.content ? new PostContent(body.content) : undefined,
          pictureUrl: body.picture_url ? new PictureUrl(body.picture_url) : undefined,
          category: body.id_category ? new CategoryId(body.id_category) : undefined,
          tags: body.tags ? new TagList(body.tags) : undefined,
        },
      });
    } catch (error: any) {
      this.logger.error(error);

      if (error instanceof BlogPostNotFoundException) {
        throw new NotFoundException('Post not found');
      } else if (error instanceof ConcurrentUpdatesException) {
        throw new ConflictException('Concurrent updates to the same post');
      }

      throw error;
    }
  }

  @Delete('/:id(\\d+)')
  @AllowedRoles([Roles.User])
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.posts.delete({
        id: new PostId(Number(id)),
      });
    } catch (error: any) {
      if (error instanceof BlogPostNotFoundException) {
        throw new NotFoundException(`Post not found`);
      }

      throw error;
    }
  }
}
