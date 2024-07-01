import { OrganisationsUsers, User } from '@prisma/client';
import { prismaOrgRoleToModel } from 'src/permission/dto/org-role.dto';
import { LoggedInUser } from '../model/user.model';

export function transformLoggedInUser(
  user: User & { organisations: OrganisationsUsers[] },
) {
  return new LoggedInUser({
    ...user,
    orgId: user.organisations[0].orgId,
    orgRole: prismaOrgRoleToModel(user.organisations[0].role),
  });
}
