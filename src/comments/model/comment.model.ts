import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Many } from 'src/common/model/many.model';
import { Paginated } from 'src/common/model/paginated.model';
import { User } from 'src/users/model/user.model';

export class Comment {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @Expose() id: string;

  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @Expose() postId: string;

  /**
   * @example "Intelligence is the ability to adapt to change."
   */
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

export class PaginatedPostComments extends Paginated(PostComment) {}

export class ManyPostComments extends Many(PostComment) {}
