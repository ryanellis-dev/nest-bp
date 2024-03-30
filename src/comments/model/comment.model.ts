import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Many } from 'src/common/model/many.model';
import { User } from 'src/users/model/user.model';

export class Comment {
  @Expose() id: string;
  @Expose() postId: string;
  @Expose() body: string;
  @Expose() createdAt: Date;
  @Expose()
  @Type(() => CommentAuthor)
  author: CommentAuthor | null;

  constructor(data: Comment) {
    Object.assign(this, data);
  }
}

export class CommentAuthor extends User {}

export class PostComment extends OmitType(Comment, ['postId']) {
  constructor(data: PostComment) {
    super();
    Object.assign(this, data);
  }
}

export class ManyPostComments extends Many(PostComment) {}
