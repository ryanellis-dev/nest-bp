import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class DomainsRepo {
  constructor(private prisma: PrismaService) {}

  createDomain(args: {
    data: Omit<Prisma.DomainCreateInput, 'site'>;
    siteId: string;
  }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.domain.create({
      data: {
        ...args.data,
        site: {
          connect: {
            id: args.siteId,
            ...(orgId && {
              organisation: {
                id: orgId,
              },
            }),
          },
        },
      },
    });
  }

  getDomains(args: { siteId: string }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.domain.findMany({
      where: {
        site: {
          id: args.siteId,
          ...(orgId && {
            organisation: {
              id: orgId,
            },
          }),
        },
      },
    });
  }
}
