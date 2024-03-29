import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ManyPosts, Post } from './model/post.model';
import { PostsRepo } from './posts.repo';

@Injectable()
export class PostsService {
  constructor(private postsRepo: PostsRepo) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    return new Post(
      await this.postsRepo.createPost({
        data,
      }),
    );
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    return new Post(
      await this.postsRepo.updatePost({
        where: {
          id,
        },
        data,
      }),
    );
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

  async deletePost(id: string): Promise<void> {
    await this.postsRepo.deletePost({ where: { id } });
  }
}
