import { Injectable, NotFoundException } from '@nestjs/common';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-params.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ManyPosts, Post } from './model/post.model';
import { PostsRepo } from './posts.repo';

@Injectable()
export class PostsService {
  constructor(private postsRepo: PostsRepo) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    const user = getUserOrThrow();
    return new Post(
      await this.postsRepo.createPost({
        data: {
          ...data,
          author: {
            connect: {
              id: user.id,
            },
          },
        },
        includeAuthor: true,
      }),
    );
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const user = getUserOrThrow();
    return new Post(
      await this.postsRepo.updatePost({
        where: {
          id,
          author: {
            id: user.id,
          },
        },
        data,
        includeAuthor: true,
      }),
    );
  }

  async getPost(id: string): Promise<Post> {
    const post = await this.postsRepo.getPost({
      where: {
        id,
      },
      includeAuthor: true,
    });
    if (!post) throw new NotFoundException();
    return new Post(post);
  }

  async getPosts(query: GetPostsQueryDto): Promise<ManyPosts> {
    const posts = await this.postsRepo.getPosts({
      where: {
        author: {
          id: query.author,
        },
      },
      includeAuthor: true,
    });
    return { results: posts.map((p) => new Post(p)) };
  }

  async deletePost(id: string): Promise<void> {
    const user = getUserOrThrow();
    await this.postsRepo.deletePost({
      where: {
        id,
        author: {
          id: user.id,
        },
      },
    });
  }
}
