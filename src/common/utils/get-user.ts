import { UnauthorizedException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TypedClsStore } from '../types/cls.types';

export function getUserFromStore(cls: ClsService<TypedClsStore>) {
  const user = cls.get('user');
  if (!user) throw new UnauthorizedException();
  return user;
}
