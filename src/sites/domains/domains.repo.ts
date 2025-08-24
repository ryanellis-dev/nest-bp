import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class DomainsRepo {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  createDomain(args: {
    data: Omit<Prisma.DomainCreateInput, 'site'>;
    siteId: string;
  }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.domain.create({
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
    return this.txHost.tx.domain.findMany({
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
