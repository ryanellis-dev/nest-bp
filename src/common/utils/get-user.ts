import { UnauthorizedException } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { TypedClsStore } from '../types/cls.types';

export function getUserOrThrow() {
  const cls = ClsServiceManager.getClsService<TypedClsStore>();
  const user = cls.get('user');
  if (!user) throw new UnauthorizedException();
  return user;
}

export function getUserFromStore() {
  const cls = ClsServiceManager.getClsService<TypedClsStore>();
  const user = cls.get('user');
  return user || null;
}
