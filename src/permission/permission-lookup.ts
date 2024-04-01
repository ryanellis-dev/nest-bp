import { Permission, allActionsToString } from './model/permission.model';
import { EnumPostRole } from './model/post-role.model';

const POST_PERMISSIONS_LOOKUP = {
  [EnumPostRole.Owner]: ['*:post'],
  [EnumPostRole.Editor]: ['read:post', 'update:post'],
  [EnumPostRole.Reader]: ['read:post'],
};

export function can(permission: Permission, postRole?: EnumPostRole) {
  if (!postRole) {
    // TODO: Further checks can be done for create permission here
    return true;
  }
  const allowedPermissions = POST_PERMISSIONS_LOOKUP[postRole];
  const allActionsString = allActionsToString(permission.type);
  return (
    allowedPermissions.includes(permission.toString()) ||
    allowedPermissions.includes(allActionsString)
  );
}
