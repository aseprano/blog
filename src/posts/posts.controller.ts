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
  BadRequestException,
  ForbiddenException, Get, Query,
} from '@nestjs/common';
import { PostsManagementService } from '../domain/app_services/PostsManagementService';
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
import { InvalidNumberOfTagsException } from '../domain/exceptions/InvalidNumberOfTagsException';
import { BlogSearchService, SearchParams } from '../domain/app_services/BlogSearchService';
import { CreatePost } from '../dto/CreatePost';
import { CreatePostResponse } from '../dto/CreatePostResponse';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UpdatePostDTO } from '../dto/UpdatePostDTO';
import { FullBlogPostResponse } from '../dto/FullBlogPostResponse';
import { TagsList } from '../dto/TagsList';

@Controller('/posts')
@UseGuards(RolesGuard)
export class PostsController {
  public constructor(
    private readonly posts: PostsManagementService,
    private readonly searchService: BlogSearchService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiOperation({ description: 'Creates a new blog post' })
  @ApiOkResponse({
    status: 200,
    type: CreatePostResponse,
  })
  async create(@Body() body: CreatePost): Promise<CreatePostResponse> {
    try {
      const newId = await this.posts.create({
        properties: {
          title: new PostTitle(body.title),
          content: new PostContent(body.content),
          pictureUrl: new PictureUrl(body.picture_url),
          category: new CategoryId(body.id_category),
          tags: TagList.parse(body.tags),
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
  @ApiOperation({ description: 'Updates a blog post' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostDTO,
  ): Promise<void> {
    try {
      await this.posts.update({
        id: new PostId(Number(id)),
        properties: {
          title: body.title ? new PostTitle(body.title) : undefined,
          content: body.content ? new PostContent(body.content) : undefined,
          pictureUrl: body.picture_url ? new PictureUrl(body.picture_url) : undefined,
          category: body.id_category ? new CategoryId(body.id_category) : undefined,
          tags: body.tags ? TagList.parse(body.tags) : undefined,
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

  @Get('/:id(\\d+)')
  @ApiOperation({ description: 'View the content of a post' })
  @ApiOkResponse({
    status: 200,
    type: FullBlogPostResponse,
  })
  async viewPost(
    @Param('id') id: string,
  ): Promise<FullBlogPostResponse> {
    try {
      return await this.searchService.getPost(Number(id));
    } catch (error: any) {
      if (error instanceof BlogPostNotFoundException) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Get()
  @ApiOperation({ description: 'Searches for posts in the blog' })
  async search(
    @Query('title') title?: string,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
  ): Promise<any> {
    const searchParams: SearchParams = {
      title,
      category,
      tag,
    };

    const result = await this.searchService.search(searchParams);

    return {
      posts: result,
    };
  }

  @Delete('/:id(\\d+)')
  @ApiOperation({ description: 'Deletes a post (admins only)' })
  @AllowedRoles([Roles.Admin])
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

  @Post('/:id(\\d+)/tags')
  @ApiOperation({ description: 'Assigns new tags to a post' })
  async addTags(
    @Param('id') id: string,
    @Body() body: TagsList,
  ): Promise<any> {
    try {
      const postId = new PostId(Number(id));
      const tags = TagList.parse(body.tags);

      this.logger.debug(`Wanna add the following tags to post ${postId}: ${tags}`);

      await this.posts.addTags({
        id: postId,
        tags,
      });
    } catch (error: any) {
      if (error instanceof InvalidTagListException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof BlogPostNotFoundException) {
        throw new NotFoundException(`Post not found`);
      } else if (error instanceof ConcurrentUpdatesException) {
        throw new ConflictException();
      }

      throw error;
    }
  }

  @Delete('/:id(\\d+)/tags')
  @ApiOperation({ description: 'Removes a list of tags from a post' })
  async removeTagsFromPost(
    @Param('id') id: string,
    @Body() body: TagsList,
  ): Promise<any> {
    const postId = new PostId(Number(id));
    this.logger.debug(`Wanna delete some tags from post ${postId}`);

    const tagsToRemove = TagList.parse(body.tags);
    this.logger.debug(`Tags to remove: ${tagsToRemove}`);

    try {
      await this.posts.removeTags({
        id: postId,
        tags: tagsToRemove,
      });
    } catch (error: any) {
      if (error instanceof InvalidTagListException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof BlogPostNotFoundException) {
        throw new NotFoundException(`Post not found`);
      } else if (error instanceof InvalidNumberOfTagsException) {
        throw new ForbiddenException(`A post must contain at least one tag`);
      } else if (error instanceof ConcurrentUpdatesException) {
        throw new ConflictException();
      }

      throw error;
    }
  }
}
