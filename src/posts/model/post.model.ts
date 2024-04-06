import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Many } from 'src/common/model/many.model';
import { Paginated } from 'src/common/model/paginated.model';

export class Post {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @Expose() id: string;

  /**
   * @example "A Brief History of Time"
   */
  @Expose() title: string;

  /**
   * @example "Stephen Hawking provides a concise overview of the universe's origins, black holes, and the quest for a unified theory of physics."
   */
  @Expose() body: string;

  /**
   * @example false
   */
  @Expose() public: boolean;

  @Expose() createdAt: Date;

  @ApiProperty()
  @Expose()
  get commentCount(): number {
    return this._count.comments;
  }

  @ApiHideProperty()
  @Exclude()
  _count: {
    comments: number;
  };

  constructor(data: Omit<Post, 'commentCount'>) {
    Object.assign(this, data);
  }
}

export class ManyPosts extends Many(Post) {}

export class PaginatedPosts extends Paginated(Post) {}
