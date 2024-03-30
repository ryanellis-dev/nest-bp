import { Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TypedClsStore } from 'src/common/types/cls.types';
import { getUserFromStore } from 'src/common/utils/get-user';
import { PostsRepo } from 'src/posts/posts.repo';
import { CommentsRepo } from './comments.repo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, ManyPostComments, PostComment } from './model/comment.model';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepo: CommentsRepo,
    private postsRepo: PostsRepo,
    private cls: ClsService<TypedClsStore>,
  ) {}

  async createComment(
    postId: string,
    data: CreateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsRepo.createComment({
      data: {
        post: {
          connect: {
            id: postId,
          },
        },
        ...data,
      },
    });
    return new Comment(comment);
  }

  async updateComment(
    postId: string,
    commentId: string,
    data: UpdateCommentDto,
  ): Promise<Comment> {
    const user = getUserFromStore(this.cls);
    const comment = await this.commentsRepo.updateComment({
      where: {
        id: commentId,
        postId,
        author: {
          id: user.sub,
        },
      },
      data,
    });
    return new Comment(comment);
  }

  async getComments(postId: string): Promise<ManyPostComments> {
    const comments = await this.postsRepo.getPostComments({
      where: {
        id: postId,
      },
    });
    if (comments === null) throw new NotFoundException();
    return {
      results: comments.map((c) => new PostComment(c)),
    };
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    const user = getUserFromStore(this.cls);
    await this.commentsRepo.deleteComment({
      where: {
        id: commentId,
        postId,
        author: {
          id: user.sub,
        },
      },
    });
  }
}
