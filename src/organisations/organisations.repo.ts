import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrganisationsRepo {
  constructor(private prisma: PrismaService) {}

  async createOrganisation(args: { data: Prisma.OrganisationCreateInput }) {
    return this.prisma.organisation.create({
      data: args.data,
    });
  }

  async getOrganisation(args: { where: Prisma.OrganisationWhereInput }) {
    return this.prisma.organisation.findFirst({
      where: args.where,
    });
  }
}
