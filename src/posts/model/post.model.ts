import { Exclude, Expose, Type } from 'class-transformer';
import { Many } from 'src/common/model/many.model';
import { User } from 'src/users/model/user.model';

export class Post {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() body: string;
  @Expose() public: boolean;
  @Expose() createdAt: Date;
  @Expose()
  @Type(() => PostAuthor)
  author: PostAuthor | null;

  @Exclude()
  _count: {
    comments: number;
  };
  @Expose() get commentCount(): number {
    return this._count.comments;
  }

  constructor(data: Omit<Post, 'commentCount'>) {
    Object.assign(this, data);
  }
}

export class PostAuthor extends User {}

export class ManyPosts extends Many(Post) {}
