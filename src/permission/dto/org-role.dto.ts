import { OrgRole } from '@prisma/client';
import { EnumOrgRole } from '../model/org-role.model';

const ENUM_MAP = {
  [OrgRole.ADMIN]: EnumOrgRole.Admin,
  [OrgRole.MEMBER]: EnumOrgRole.Member,
};

export function prismaOrgRoleToModel(role: OrgRole) {
  return ENUM_MAP[role];
}
