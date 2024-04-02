import { EnumOrgRole } from './model/org-role.model';
import { Permission, allActionsToString } from './model/permission.model';
import { EnumPostRole } from './model/post-role.model';

const POST_PERMISSIONS_LOOKUP = {
  [EnumPostRole.Owner]: ['*:post'],
  [EnumPostRole.Editor]: ['read:post', 'update:post'],
  [EnumPostRole.Reader]: ['read:post'],
};

const ORG_PERMISSIONS_LOOKUP = {
  [EnumOrgRole.Admin]: ['*:post', '*:user'],
  [EnumOrgRole.Member]: ['read:user'],
};

// TODO: Use casl to move all logic into a consolidated library
export function can(
  permission: Permission,
  orgRole: EnumOrgRole,
  postRole?: EnumPostRole,
) {
  const allowedPermissions = [...ORG_PERMISSIONS_LOOKUP[orgRole]];
  postRole && allowedPermissions.concat(POST_PERMISSIONS_LOOKUP[postRole]);
  const allActionsString = allActionsToString(permission.type);
  return (
    allowedPermissions.includes(permission.toString()) ||
    allowedPermissions.includes(allActionsString)
  );
}
