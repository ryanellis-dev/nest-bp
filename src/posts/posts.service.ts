import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { ManyPosts, Post } from './models/post.model';
import { PostsRepo } from './posts.repo';

@Injectable()
export class PostsService {
  constructor(private postsRepo: PostsRepo) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    return this.postsRepo.createPost({
      data: {
        title: data.title,
        body: data.body,
        public: data.public,
      },
    });
  }

  async getPost(id: string): Promise<Post> {
    const post = await this.postsRepo.getPost({ where: { id } });
    if (!post) throw new NotFoundException();
    return new Post(post);
  }

  async getPosts(): Promise<ManyPosts> {
    const posts = await this.postsRepo.getPosts({});
    return { posts: posts.map((p) => new Post(p)) };
  }
}
