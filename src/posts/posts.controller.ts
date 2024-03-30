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
import { GetPostsQueryDto } from './dto/get-posts-params.dto';
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

  @Patch('/:id')
  updatePost(@Param('id') id: string, @Body() data: UpdatePostDto) {
    return this.postsService.updatePost(id, data);
  }

  @Get('/:id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Get()
  getPosts(@Query() query: GetPostsQueryDto) {
    return this.postsService.getPosts(query);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
