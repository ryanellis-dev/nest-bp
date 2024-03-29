import { Exclude, Expose } from 'class-transformer';

export class Comment {
  @Expose() id: string;
  @Expose() postId: string;
  @Expose() userId: string | null;
  @Expose() body: string;
  @Expose() createdAt: Date;

  constructor(data: Comment) {
    Object.assign(this, data);
  }
}

export class PostComment extends Comment {
  @Exclude() postId: string;
}

export class ManyPostComments {
  comments: PostComment[];
}
