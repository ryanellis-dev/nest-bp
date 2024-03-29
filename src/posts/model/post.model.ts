import { Expose } from 'class-transformer';

export class Post {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() body: string;
  @Expose() public: boolean;
  @Expose() createdAt: Date;

  _count: {
    comments: number;
  };
  @Expose() get commentCount(): number {
    return this._count.comments;
  }

  constructor(data: Partial<Post>) {
    Object.assign(this, data);
  }
}

export class ManyPosts {
  posts: Post[];
}
