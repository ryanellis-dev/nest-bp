import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CommentsRepo } from 'src/comments/comments.repo';
import { TypedClsStore } from 'src/common/types/cls.types';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { PostWithRole } from 'src/posts/model/post.model';
import { PostsRepo } from 'src/posts/posts.repo';
import { Comment } from '../comments/model/comment.model';
import { transformPostWithRole } from './dto/post-role.dto';
import { Permission } from './model/permission.model';
import { ResourceType } from './model/resources.model';

@Injectable()
export class PermissionsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
    private caslAbilityFactory: CaslAbilityFactory,
    private cls: ClsService<TypedClsStore>,
  ) {}

  setContext(permission: Permission, resource: any) {
    if (!this.cls.get('permissions')?.push({ permission, resource })) {
      this.cls.set('permissions', [{ permission, resource }]);
    }
  }

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
          ? await this.postsRepo.getPostWithRole({
              where: {
                id: resourceId,
              },
              userId: user.id,
            })
          : undefined;
        if (post === null) throw new NotFoundException();

        post &&
          this.setContext(permission, transformPostWithRole(post, user.id));

        return ability.can(
          permission.action,
          post ? transformPostWithRole(post, user.id) : PostWithRole,
        );

      case ResourceType.Comment:
        const comment = await this.commentsRepo.getComment({
          where: {
            id: resourceId,
          },
        });
        if (!comment) throw new NotFoundException();

        this.setContext(permission, new Comment(comment));
        return ability.can(permission.action, new Comment(comment));

      default:
        return true;
    }
  }
}
