import { ClsStore } from 'nestjs-cls';
import { AuthPayload } from './auth.types';

export interface TypedClsStore extends ClsStore {
  // Null if auth has been bypassed
  user?: AuthPayload | null;
}
