import { ClsServiceManager } from 'nestjs-cls';
import { TypedClsStore } from '../types/cls.types';

export function getOrgIdFromStore() {
  const cls = ClsServiceManager.getClsService<TypedClsStore>();
  const user = cls.get('user');
  return user?.orgId || null;
}
