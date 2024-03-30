import { Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TypedClsStore } from 'src/common/types/cls.types';
import { getUserFromStore } from 'src/common/utils/get-user';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ManyPosts, Post } from './model/post.model';
import { PostsRepo } from './posts.repo';

@Injectable()
export class PostsService {
  constructor(
    private postsRepo: PostsRepo,
    private cls: ClsService<TypedClsStore>,
  ) {}

  async createPost(data: CreatePostDto): Promise<Post> {
    const user = getUserFromStore(this.cls);
    return new Post(
      await this.postsRepo.createPost({
        data: {
          ...data,
          author: {
            connect: {
              id: user.sub,
            },
          },
        },
      }),
    );
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const user = getUserFromStore(this.cls);
    return new Post(
      await this.postsRepo.updatePost({
        where: {
          id,
          author: {
            id: user.sub,
          },
        },
        data,
      }),
    );
  }

  async getPost(id: string): Promise<Post> {
    const post = await this.postsRepo.getPost({
      where: {
        id,
      },
    });
    if (!post) throw new NotFoundException();
    return new Post(post);
  }

  async getPosts(): Promise<ManyPosts> {
    const posts = await this.postsRepo.getPosts({ includeAuthor: true });
    return { results: posts.map((p) => new Post(p)) };
  }

  async deletePost(id: string): Promise<void> {
    const user = getUserFromStore(this.cls);
    await this.postsRepo.deletePost({
      where: {
        id,
        author: {
          id: user.sub,
        },
      },
    });
  }
}
