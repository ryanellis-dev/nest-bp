import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { Require } from 'src/common/decorators/require-permissions.decorator';
import { Action } from 'src/permission/model/action.model';
import { Permission } from 'src/permission/model/permission.model';
import { ResourceType } from 'src/permission/model/resources.model';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostParamsDto } from './dto/post-params.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@Catch(PrismaClientExceptionFilter)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @Require(new Permission(Action.Create, ResourceType.Post))
  createPost(@Body() data: CreatePostDto) {
    return this.postsService.createPost(data);
  }

  @Patch('/:postId')
  @Require(new Permission(Action.Update, ResourceType.Post))
  updatePost(@Param() params: PostParamsDto, @Body() data: UpdatePostDto) {
    return this.postsService.updatePost(params.postId, data);
  }

  @Get('/:postId')
  @Require(new Permission(Action.Read, ResourceType.Post))
  getPost(@Param() params: PostParamsDto) {
    return this.postsService.getPost(params.postId);
  }

  @Get()
  @Require(new Permission(Action.Read, ResourceType.Post))
  getPosts(@Query() query: GetPostsQueryDto) {
    return this.postsService.getPosts(query);
  }

  @Delete('/:postId')
  @Require(new Permission(Action.Delete, ResourceType.Post))
  deletePost(@Param() params: PostParamsDto) {
    return this.postsService.deletePost(params.postId);
  }
}
