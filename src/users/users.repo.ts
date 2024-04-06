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
          organisations: {
            create: {
              orgId,
            },
          },
        }),
      },
    });
  }

  async deleteUser(args: { where: Prisma.UserWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.delete({
      where: {
        ...args.where,
        ...(orgId && {
          organisations: {
            some: {
              orgId,
            },
          },
        }),
      },
    });
  }

  async getUser(args: { where: Prisma.UserWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.findUnique({
      where: {
        ...args.where,
        ...(orgId && {
          organisations: {
            some: {
              orgId,
            },
          },
        }),
      },
    });
  }

  async getLoggedInUser(args: { userId: string; orgId: string }) {
    // User / org context is unavailable in this method
    return this.prisma.user.findFirst({
      where: {
        id: args.userId,
        organisations: {
          some: {
            orgId: args.orgId,
          },
        },
      },
      include: {
        organisations: {
          where: {
            orgId: args.orgId,
          },
        },
      },
    });
  }

  async getUsers(args: {
    where?: Prisma.UserWhereInput;
    take?: number;
    skip?: number;
  }) {
    const orgId = getOrgIdFromStore();
    const where = {
      ...args.where,
      ...(orgId && {
        organisations: {
          some: {
            orgId,
          },
        },
      }),
    };
    return this.prisma.$transaction(async (tx) => {
      return {
        users: await tx.user.findMany({
          where,
          take: args.take,
          skip: args.skip,
          orderBy: {
            name: 'asc',
          },
        }),
        total: await tx.user.count({ where }),
      };
    });
  }

  async updateUser(args: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.user.update({
      where: {
        ...args.where,
        ...(orgId && {
          organisations: {
            some: {
              orgId,
            },
          },
        }),
      },
      data: args.data,
    });
  }
}
