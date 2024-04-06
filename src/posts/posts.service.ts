import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatedPosts, Post } from './model/post.model';
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
          users: {
            create: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              role: 'OWNER',
            },
          },
        },
        includeAuthor: true,
      }),
    );
  }

  async updatePost(postId: string, data: UpdatePostDto): Promise<Post> {
    return new Post(
      await this.postsRepo.updatePost({
        where: {
          id: postId,
        },
        data,
        includeAuthor: true,
      }),
    );
  }

  async getPost(postId: string): Promise<Post> {
    const post = await this.postsRepo.getPost({
      where: {
        id: postId,
      },
      includeAuthor: true,
    });
    if (!post) throw new NotFoundException();
    return new Post(post);
  }

  async getPosts(
    query: GetPostsQueryDto,
    { limit, offset }: PaginationQueryDto,
  ): Promise<PaginatedPosts> {
    const { posts, total } = await this.postsRepo.getPosts({
      where: {
        ...(query.author && {
          users: {
            some: {
              userId: query.author,
              role: 'OWNER',
            },
          },
        }),
      },
      includeAuthor: true,
      take: limit,
      skip: offset,
    });
    return { results: posts.map((p) => new Post(p)), limit, offset, total };
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsRepo.deletePost({
      where: {
        id: postId,
      },
    });
  }
}
