import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permission } from 'src/permission/model/permission.model';
import { ResourceType } from 'src/permission/model/resources.model';
import { PermissionsService } from 'src/permission/permissions.service';
import { REQUIRE_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { Params } from '../model/params.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  getResourceIdFromParams(resourceType: ResourceType, params: Params) {
    switch (resourceType) {
      case ResourceType.User:
        return params.userId;
      case ResourceType.Post:
        return params.postId;
      case ResourceType.Comment:
        return params.commentId;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const requiredPermissions = this.reflector.getAllAndMerge<Permission[]>(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    for (const permission of requiredPermissions) {
      const resourceId = this.getResourceIdFromParams(
        permission.type,
        req.params,
      );
      if (
        !(await this.permissionsService.checkPermission(permission, resourceId))
      )
        return false;
    }
    return true;
  }
}
