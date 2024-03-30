import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class PostsRepo {
  constructor(private prisma: PrismaService) {}

  createPost(args: { data: Prisma.PostCreateInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.post.create({
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
      include: {
        _count: { select: { comments: true } },
      },
    });
  }

  updatePost(args: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.post.update({
      where: { ...args.where, deletedAt: null },
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
      include: {
        _count: { select: { comments: true } },
      },
    });
  }

  getPost(args: { where?: Prisma.PostWhereInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.post.findFirst({
      where: { ...args.where, deletedAt: null, ...(orgId && { orgId }) },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    });
  }

  getPosts(args: { where?: Prisma.PostWhereInput; includeAuthor?: boolean }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.post.findMany({
      where: { ...args.where, deletedAt: null, ...(orgId && { orgId }) },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
        ...(args.includeAuthor && { author: true }),
      },
    });
  }

  async getPostComments(args: { where?: Prisma.PostWhereInput }) {
    const orgId = getOrgIdFromStore();
    return (
      (
        await this.prisma.post.findFirst({
          where: { ...args.where, deletedAt: null, ...(orgId && { orgId }) },
          select: {
            comments: {
              where: {
                deletedAt: null,
              },
            },
          },
        })
      )?.comments || null
    );
  }

  deletePost(args: { where: Prisma.PostWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.post.update({
      where: { ...args.where, deletedAt: null, ...(orgId && { orgId }) },
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
