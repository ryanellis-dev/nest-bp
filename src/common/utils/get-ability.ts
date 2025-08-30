import { ClsServiceManager } from 'nestjs-cls';
import { TypedClsStore } from '../types/cls.types';

export function getAbilityFromStore() {
  const cls = ClsServiceManager.getClsService<TypedClsStore>();
  const ability = cls.get('ability');
  return ability;
}
