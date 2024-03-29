export class Post {
  id: string;
  title: string;
  body: string;
  public: boolean;
  createdAt: Date;

  constructor(data: Partial<Post>) {
    Object.assign(this, data);
  }
}

export class ManyPosts {
  posts: Post[];
}
