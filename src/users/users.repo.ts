import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class UsersRepo {
  constructor(private prisma: PrismaService) {}

  async createUser(args: { data: Prisma.UserCreateInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.create({
      data: {
        ...args.data,
        ...(orgId && {
          organisation: {
            connect: {
              id: orgId,
            },
          },
        }),
      },
    });
  }

  async deleteUser(args: { where: Prisma.UserWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.delete({
      where: { ...args.where, ...(orgId && { orgId }) },
    });
  }

  async getUser(args: { where: Prisma.UserWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.findFirst({
      where: { ...args.where, ...(orgId && { orgId }) },
    });
  }

  async getUsers(args: { where?: Prisma.UserWhereInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.findMany({
      where: { ...args.where, ...(orgId && { orgId }) },
    });
  }

  async updateUser(args: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.update({
      where: { ...args.where, ...(orgId && { orgId }) },
      data: args.data,
    });
  }
}
