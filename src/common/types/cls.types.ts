import { ClsStore } from 'nestjs-cls';
import { LoggedInUser } from 'src/users/model/user.model';

export interface TypedClsStore extends ClsStore {
  // Null if auth has been bypassed
  user?: LoggedInUser | null;
}
