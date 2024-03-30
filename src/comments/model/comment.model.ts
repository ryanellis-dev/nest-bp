import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Many } from 'src/common/model/many.model';

export class Comment {
  @Expose() id: string;
  @Expose() postId: string;
  @Expose() body: string;
  @Expose() createdAt: Date;

  constructor(data: Comment) {
    Object.assign(this, data);
  }
}

export class PostComment extends OmitType(Comment, ['postId']) {
  constructor(data: PostComment) {
    super();
    Object.assign(this, data);
  }
}

export class ManyPostComments extends Many(PostComment) {}
