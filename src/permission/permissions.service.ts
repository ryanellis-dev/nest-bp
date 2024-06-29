import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CommentsRepo } from 'src/comments/comments.repo';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { PostWithUsers } from 'src/posts/model/post.model';
import { PostsRepo } from 'src/posts/posts.repo';
import { Comment } from '../comments/model/comment.model';
import { prismaPostRoleToModel } from './dto/post-role.dto';
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
    const user = getUserOrThrow();
    if (!user) {
      Logger.error('Could not get user from request context.');
      return false;
    }
    const ability = this.caslAbilityFactory.createForLoggedInUser(user);

    switch (permission.type) {
      case ResourceType.User:
        // TODO: Needs implementation
        return true;
      case ResourceType.Post:
        const post = resourceId
          ? await this.postsRepo.getPost({
              where: {
                id: resourceId,
              },
            })
          : undefined;
        if (post === null) throw new NotFoundException();
        return ability.can(
          permission.action,
          post
            ? new PostWithUsers({
                ...post,
                users: post.users.map((u) => ({
                  ...u,
                  role: prismaPostRoleToModel(u.role),
                })),
              })
            : PostWithUsers,
        );
      case ResourceType.Comment:
        const comment = await this.commentsRepo.getComment({
          where: {
            id: resourceId,
          },
        });
        if (!comment) throw new NotFoundException();
        return ability.can(permission.action, new Comment(comment));
      default:
        return true;
    }
  }
}
