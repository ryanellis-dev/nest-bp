import { TransactionHost } from '@nestjs-cls/transactional';
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

  async getOrganisation(args: { where: Prisma.OrganisationWhereInput }) {
    return this.txHost.tx.organisation.findFirst({
      where: args.where,
    });
  }
}
