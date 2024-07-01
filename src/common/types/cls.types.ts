import { ClsStore } from 'nestjs-cls';
import { Permission } from 'src/permission/model/permission.model';
import { LoggedInUser } from 'src/users/model/user.model';

export interface TypedClsStore extends ClsStore {
  // Null if auth has been bypassed
  user?: LoggedInUser | null;

  permissions?: { permission: Permission; resource: any }[];
}
