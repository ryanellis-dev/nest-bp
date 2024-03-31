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
  createPost(@Body() data: CreatePostDto) {
    return this.postsService.createPost(data);
  }

  @Patch('/:postId')
  updatePost(@Param() params: PostParamsDto, @Body() data: UpdatePostDto) {
    return this.postsService.updatePost(params.postId, data);
  }

  @Get('/:postId')
  getPost(@Param() params: PostParamsDto) {
    return this.postsService.getPost(params.postId);
  }

  @Get()
  getPosts(@Query() query: GetPostsQueryDto) {
    return this.postsService.getPosts(query);
  }

  @Delete('/:postId')
  deletePost(@Param() params: PostParamsDto) {
    return this.postsService.deletePost(params.postId);
  }
}
