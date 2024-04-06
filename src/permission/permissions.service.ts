import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CommentsRepo } from 'src/comments/comments.repo';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { Post } from 'src/posts/model/post.model';
import { PostsRepo } from 'src/posts/posts.repo';
import { Permission } from './model/permission.model';
import { ResourceType } from './model/resources.model';

@Injectable()
export class PermissionsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
    private caslAbilityFactory: CaslAbilityFactory,
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
        return this.caslAbilityFactory
          .createForLoggedInUser(user)
          .can(permission.action, Post);
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
