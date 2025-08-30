import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrganisationsRepo {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async createOrganisation(args: { data: Prisma.OrganisationCreateInput }) {
    return this.txHost.tx.organisation.create({
      data: args.data,
    });
  }

  @Transactional()
  async getOrganisations(args?: {
    where?: Prisma.OrganisationWhereInput;
    take?: number;
    skip?: number;
  }) {
    return {
      organisations: await this.txHost.tx.organisation.findMany({
        where: args?.where,
        take: args?.take,
        skip: args?.skip,
      }),
      total: await this.txHost.tx.organisation.count({
        where: args?.where,
      }),
    };
  }

  async getOrganisation(args: { where: Prisma.OrganisationWhereInput }) {
    return this.txHost.tx.organisation.findFirst({
      where: args.where,
    });
  }
}
