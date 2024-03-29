import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ManyPosts } from './model/post.model';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
@Catch(PrismaClientExceptionFilter)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async createPost(@Body() data: CreatePostDto) {
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
  getPosts(): Promise<ManyPosts> {
    return this.postsService.getPosts();
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
