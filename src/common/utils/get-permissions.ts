import { ClsServiceManager } from 'nestjs-cls';
import { TypedClsStore } from '../types/cls.types';

export function getPermissionsFromStore() {
  const cls = ClsServiceManager.getClsService<TypedClsStore>();
  return cls.get('permissions');
}
