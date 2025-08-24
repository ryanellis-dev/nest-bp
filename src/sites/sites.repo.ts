import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrganisationRequiredException } from 'src/common/exceptions';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class SitesRepo {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  createSite(args: {
    data: Omit<Prisma.SiteCreateInput, 'organisation'>;
    orgId?: string;
  }) {
    const orgId = args.orgId || getOrgIdFromStore();
    if (!orgId) throw new OrganisationRequiredException();
    return this.txHost.tx.site.create({
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
    return this.txHost.tx.site.update({
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
    return this.txHost.tx.site.findFirst({
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
    return this.txHost.tx.site.findMany({
      where: {
        ...(orgId && {
          orgId,
        }),
      },
    });
  }
}
