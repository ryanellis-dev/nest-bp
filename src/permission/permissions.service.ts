import { subject } from '@casl/ability';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TypedClsStore } from 'src/common/types/cls.types';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { CommentsRepo } from 'src/posts/comments/comments.repo';
import { PostsRepo } from 'src/posts/posts.repo';
import { Site } from 'src/sites/model/site.model';
import { SitesRepo } from 'src/sites/sites.repo';
import { Comment } from '../posts/comments/model/comment.model';
import {
  AppAbility,
  CaslAbilityFactory,
} from './casl/casl-ability.factory/casl-ability.factory';
import { transformPostWithRole } from './dto/post-role.dto';
import { Permission } from './model/permission.model';
import { ResourceType } from './model/resources.model';

@Injectable()
export class PermissionsService {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
    private sitesRepo: SitesRepo,
    private caslAbilityFactory: CaslAbilityFactory,
    private cls: ClsService<TypedClsStore>,
  ) {}

  setPermissionContext(permission: Permission, resource: any) {
    if (!this.cls.get('permissions')?.push({ permission, resource })) {
      this.cls.set('permissions', [{ permission, resource }]);
    }
  }

  setAbilityContext(ability: AppAbility) {
    this.cls.set('ability', ability);
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
    this.setAbilityContext(ability);

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
          this.setPermissionContext(
            permission,
            transformPostWithRole(post, user.id),
          );

        return ability.can(
          permission.action,
          post ? subject('Post', post) : 'Post',
        );

      case ResourceType.Comment:
        const comment = resourceId
          ? await this.commentsRepo.getComment({
              where: {
                id: resourceId,
              },
            })
          : undefined;
        if (comment === null) throw new NotFoundException();

        comment && this.setPermissionContext(permission, new Comment(comment));
        return ability.can(
          permission.action,
          comment ? subject('Comment', comment) : 'Comment',
        );

      case ResourceType.Site:
        const site = resourceId
          ? await this.sitesRepo.getSite({
              where: { id: resourceId },
            })
          : undefined;
        if (site === null) throw new NotFoundException();

        site && this.setPermissionContext(permission, new Site(site));
        return ability.can(
          permission.action,
          site ? subject('Site', site) : 'Site',
        );

      default:
        return true;
    }
  }
}
