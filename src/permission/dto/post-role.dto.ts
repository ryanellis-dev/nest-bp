import { PostRole } from '@prisma/client';
import { EnumPostRole } from '../model/post-role.model';

const ENUM_MAP = {
  [PostRole.OWNER]: EnumPostRole.Owner,
  [PostRole.EDITOR]: EnumPostRole.Editor,
  [PostRole.READER]: EnumPostRole.Reader,
};

export function prismaPostRoleToModel(role: PostRole) {
  return ENUM_MAP[role];
}
