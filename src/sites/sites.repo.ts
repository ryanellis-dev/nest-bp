import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { OrganisationRequiredException } from 'src/common/exceptions';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class SitesRepo {
  constructor(private prisma: PrismaService) {}

  createSite(args: {
    data: Omit<Prisma.SiteCreateInput, 'organisation'>;
    orgId?: string;
  }) {
    const orgId = args.orgId || getOrgIdFromStore();
    if (!orgId) throw new OrganisationRequiredException();
    return this.prisma.site.create({
      data: {
        ...args.data,
        organisation: {
          connect: {
            id: orgId,
          },
        },
      },
    });
  }

  updateSite(args: {
    where: Prisma.SiteWhereUniqueInput;
    data: Omit<Prisma.SiteCreateInput, 'organisation'>;
  }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.site.update({
      where: {
        ...args.where,
        ...(orgId && {
          organisation: {
            id: orgId,
          },
        }),
      },
      data: args.data,
    });
  }

  getSite(args: { where: Prisma.SiteWhereInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.site.findFirst({
      where: {
        ...args.where,
        ...(orgId && {
          organisation: {
            id: orgId,
          },
        }),
      },
    });
  }

  getSites() {
    const orgId = getOrgIdFromStore();
    return this.prisma.site.findMany({
      where: {
        ...(orgId && {
          orgId,
        }),
      },
    });
  }
}
