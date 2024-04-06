import { Injectable } from '@nestjs/common';
import { PostRole, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';
import { getUserFromStore } from 'src/common/utils/get-user';
import { EnumOrgRole } from 'src/permission/model/org-role.model';

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
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && {
          organisations: {
            some: {
              orgId,
            },
          },
        }),
      },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    });
  }

  getPosts(args: {
    where?: Prisma.PostWhereInput;
    includeAuthor?: boolean;
    take?: number;
    skip?: number;
  }) {
    const orgId = getOrgIdFromStore();
    const user = getUserFromStore();
    const where = {
      ...args.where,
      deletedAt: null,
      ...(orgId && { orgId }),
      ...(user &&
        user.orgRole !== EnumOrgRole.Admin && {
          users: {
            some: {
              userId: user.id,
            },
          },
        }),
    };
    return this.prisma.$transaction(async (tx) => {
      return {
        posts: await tx.post.findMany({
          where,
          take: args.take,
          skip: args.skip,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: { select: { comments: { where: { deletedAt: null } } } },
          },
        }),
        total: await tx.post.count({
          where,
        }),
      };
    });
  }

  deletePost(args: { where: Prisma.PostWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.post.update({
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && { orgId }),
      },
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
    const userOnPost = await this.prisma.usersOnPosts.findFirst({
      where: {
        post: {
          ...args.postWhere,
          ...(orgId && { orgId }),
        },
        user: {
          ...args.userWhere,
          ...(orgId && {
            organisations: {
              some: {
                orgId,
              },
            },
          }),
        },
      },
      select: {
        role: true,
        post: {
          select: {
            public: true,
          },
        },
      },
    });
    // If post is public assume reader role
    return (
      userOnPost?.role || (userOnPost?.post.public && PostRole.READER) || null
    );
  }
}
