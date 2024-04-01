import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/permission/model/permission.model';

export const REQUIRE_PERMISSIONS_KEY = 'requirePermissions';
export const Require = (...permissions: Permission[]) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);
