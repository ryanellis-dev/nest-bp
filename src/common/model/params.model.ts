import { ResourceType } from 'src/permission/model/resources.model';
import { CommentParamsDto } from 'src/posts/comments/dto/comment-params.dto';
import { PostParamsDto } from 'src/posts/dto/post-params.dto';
import { SiteParamsDto } from 'src/sites/dto/site-params.dto';
import { UserParamsDto } from 'src/users/dto/user-params.dto';

interface CombinedParams
  extends PostParamsDto,
    CommentParamsDto,
    UserParamsDto,
    SiteParamsDto {}

export type Params = Partial<CombinedParams>;

export function getResourceIdFromParams(
  resourceType: ResourceType,
  params: Params,
) {
  switch (resourceType) {
    case ResourceType.User:
      return params.userId;
    case ResourceType.Post:
      return params.postId;
    case ResourceType.Comment:
      return params.commentId;
    case ResourceType.Site:
      return params.siteId;
  }
}
