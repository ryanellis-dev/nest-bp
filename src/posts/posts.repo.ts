import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsRepo {
  constructor(private prisma: PrismaService) {}

  async createPost(args: { data: Prisma.PostCreateInput }) {
    return this.prisma.post.create({
      data: args.data,
    });
  }

  async getPost(args: { where?: Prisma.PostWhereInput }) {
    return this.prisma.post.findFirst({
      where: args.where,
    });
  }

  async getPosts(args: { where?: Prisma.PostWhereInput }) {
    return this.prisma.post.findMany({ where: args.where });
  }
}
