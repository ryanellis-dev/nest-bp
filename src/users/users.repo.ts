import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersRepo {
  constructor(private prisma: PrismaService) {}

  async createUser(args: { data: Prisma.UserCreateInput }) {
    return this.prisma.user.create({ data: args.data });
  }

  async deleteUser(args: { where: Prisma.UserWhereUniqueInput }) {
    return this.prisma.user.delete({ where: args.where });
  }

  async getUser(args: { where: Prisma.UserWhereUniqueInput }) {
    return this.prisma.user.findFirst({ where: args.where });
  }

  async getUsers(args: { where?: Prisma.UserWhereInput }) {
    return this.prisma.user.findMany({
      where: args.where,
    });
  }
}
