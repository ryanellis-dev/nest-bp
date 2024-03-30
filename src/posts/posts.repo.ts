import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsRepo {
  constructor(private prisma: PrismaService) {}

  createPost(args: { data: Prisma.PostCreateInput }) {
    return this.prisma.post.create({
      data: args.data,
      include: {
        _count: { select: { comments: true } },
      },
    });
  }

  updatePost(args: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }) {
    return this.prisma.post.update({
      where: { ...args.where, deletedAt: null },
      data: args.data,
      include: {
        _count: { select: { comments: true } },
      },
    });
  }

  getPost(args: { where?: Prisma.PostWhereInput }) {
    return this.prisma.post.findFirstOrThrow({
      where: { ...args.where, deletedAt: null },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    });
  }

  getPosts(args: { where?: Prisma.PostWhereInput }) {
    return this.prisma.post.findMany({
      where: { ...args.where, deletedAt: null },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    });
  }

  async getPostComments(args: { where?: Prisma.PostWhereInput }) {
    return (
      await this.prisma.post.findFirstOrThrow({
        where: { ...args.where, deletedAt: null },
        select: {
          comments: {
            where: {
              deletedAt: null,
            },
          },
        },
      })
    ).comments;
  }

  deletePost(args: { where: Prisma.PostWhereUniqueInput }) {
    return this.prisma.post.update({
      where: { ...args.where, deletedAt: null },
      data: {
        deletedAt: new Date(),
        comments: {
          updateMany: {
            where: {
              postId: args.where.id,
              deletedAt: null,
            },
            data: {
              deletedAt: new Date(),
            },
          },
        },
      },
    });
  }
}
