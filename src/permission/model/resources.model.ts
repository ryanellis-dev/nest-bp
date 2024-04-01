import { CommentParamsDto } from 'src/comments/dto/comment-params.dto';
import { PostParamsDto } from 'src/posts/dto/post-params.dto';
import { UserParamsDto } from 'src/users/dto/user-params.dto';

export enum ResourceType {
  Organisation = 'organisation',
  User = 'user',
  Post = 'post',
  Comment = 'comment',
}

export type ResourceParams = PostParamsDto | CommentParamsDto | UserParamsDto;
