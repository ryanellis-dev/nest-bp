import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { ManyPosts, Post as PostModel } from './models/post.model';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  createPost(@Body() data: CreatePostDto): Promise<PostModel> {
    return this.postsService.createPost(data);
  }

  @Get('/:id')
  getPost(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.getPost(id);
  }

  @Get('/')
  getPosts(): Promise<ManyPosts> {
    return this.postsService.getPosts();
  }
}
