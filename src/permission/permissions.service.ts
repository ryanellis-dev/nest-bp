import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommentsRepo } from 'src/comments/comments.repo';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { PostsRepo } from 'src/posts/posts.repo';
import { prismaPostRoleToModel } from './dto/post-role.dto';
import { Permission } from './model/permission.model';
import { ResourceType } from './model/resources.model';
import { can } from './permission-lookup';

@Injectable()
export class PermissionsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
  ) {}

  async checkPermission(
    permission: Permission,
    resourceId?: string,
  ): Promise<boolean> {
    Logger.log({ permission, resourceId });
    const user = getUserOrThrow();
    if (!user) {
      Logger.error('Could not get user from request context.');
      return false;
    }
    switch (permission.type) {
      case ResourceType.User:
        // TODO: Needs implementation
        return true;
      case ResourceType.Post:
        const postRole = resourceId
          ? await this.postsRepo.getPostRoleForUser({
              postWhere: { id: resourceId },
              userWhere: {
                id: user.id,
              },
            })
          : undefined;
        if (postRole === null) throw new NotFoundException();
        return can(
          permission,
          user.orgRole,
          postRole ? prismaPostRoleToModel(postRole) : undefined,
        );
      case ResourceType.Comment:
        return await this.commentsRepo.userIsCommentAuthor({
          userWhere: { id: user.id },
          commentWhere: { id: resourceId },
        });
      default:
        return true;
    }
  }
}
