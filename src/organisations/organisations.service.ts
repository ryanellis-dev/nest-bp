import { Injectable, NotFoundException } from '@nestjs/common';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { UsersRepo } from 'src/users/users.repo';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateCurrentOrgDto } from './dto/update-current-org.dto';
import { Organisation } from './model/organisation.model';
import { OrganisationsRepo } from './organisations.repo';

@Injectable()
export class OrganisationsService {
  constructor(
    private organisationsRepo: OrganisationsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async createOrganisation(data: CreateOrganisationDto): Promise<Organisation> {
    return this.organisationsRepo.createOrganisation({ data });
  }

  async getCurrentOrganisation(): Promise<Organisation> {
    const orgId = getOrgIdFromStore();
    if (!orgId) throw new NotFoundException();
    const org = await this.organisationsRepo.getOrganisation({
      where: { id: orgId },
    });
    if (!org) throw new NotFoundException();
    return org;
  }

  async updateCurrentOrganisation(
    data: UpdateCurrentOrgDto,
  ): Promise<Organisation | null> {
    const user = getUserOrThrow();
    const updatedUser = await this.usersRepo.updateUser({
      where: {
        id: user.id,
      },
      data: {
        organisation: {
          connect: {
            id: data.id,
          },
        },
      },
    });
    if (!updatedUser.orgId) return null;
    return await this.organisationsRepo.getOrganisation({
      where: {
        id: updatedUser.orgId,
      },
    });
  }
}
