import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';
import { getUserOrThrow } from 'src/common/utils/get-user';
import { UsersRepo } from 'src/users/users.repo';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateCurrentOrgDto } from './dto/update-current-org.dto';
import {
  Organisation,
  PaginatedOrganisations,
} from './model/organisation.model';
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

  async getOrganisations(
    { limit, offset }: PaginationQueryDto,
    { search }: SearchQueryDto,
  ): Promise<PaginatedOrganisations> {
    const { organisations, total } =
      await this.organisationsRepo.getOrganisations({
        take: limit,
        skip: offset,
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });
    return {
      results: organisations.map((o) => new Organisation(o)),
      limit,
      offset,
      total,
    };
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
    await this.usersRepo.updateUser({
      where: {
        id: user.id,
      },
      data: {
        organisations: {
          create: {
            orgId: data.id,
          },
        },
      },
    });
    return await this.organisationsRepo.getOrganisation({
      where: {
        id: data.id,
      },
    });
  }
}
