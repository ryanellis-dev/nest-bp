import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';
import { getUserFromStore } from 'src/common/utils/get-user';

@Injectable()
export class PostsRepo {
  constructor(private prisma: PrismaService) {}

  createPost(args: { data: Prisma.PostCreateInput; includeAuthor?: boolean }) {
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
    includeAuthor?: boolean;
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

  getPost(args: { where?: Prisma.PostWhereInput; includeAuthor?: boolean }) {
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
    const user = getUserFromStore();
    return this.prisma.post.findMany({
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && { orgId }),
        ...(user && {
          users: {
            some: {
              userId: user.id,
            },
          },
        }),
      },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    });
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

  async getPostRoleForUser(args: {
    postWhere: Prisma.PostWhereUniqueInput;
    userWhere: Prisma.UserWhereUniqueInput;
  }) {
    const orgId = getOrgIdFromStore();
    const post = await this.prisma.usersOnPosts.findFirst({
      where: {
        post: {
          ...args.postWhere,
          ...(orgId && { orgId }),
        },
        user: {
          ...args.userWhere,
          ...(orgId && { orgId }),
        },
      },
      select: {
        role: true,
      },
    });
    return post?.role || null;
  }
}
