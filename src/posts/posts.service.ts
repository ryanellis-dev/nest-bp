import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { transformPostWithRole } from 'src/permission/dto/post-role.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatedPosts, Post, PostWithRole } from './model/post.model';
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

  async getPost(postId: string): Promise<PostWithRole> {
    const user = getUserOrThrow();
    const post = await this.postsRepo.getPostWithRole({
      where: {
        id: postId,
      },
      userId: user.id,
    });
    if (!post) throw new NotFoundException();
    return transformPostWithRole(post, user.id);
  }

  async getPosts(
    query: GetPostsQueryDto,
    { limit, offset }: PaginationQueryDto,
  ): Promise<PaginatedPosts> {
    const user = getUserOrThrow();
    const { posts, total } = await this.postsRepo.getPostsWithRole({
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
      take: limit,
      skip: offset,
      userId: user.id,
    });
    return {
      results: posts.map((p) => transformPostWithRole(p, user.id)),
      limit,
      offset,
      total,
    };
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsRepo.deletePost({
      where: {
        id: postId,
      },
    });
  }
}
