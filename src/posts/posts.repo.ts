import { accessibleBy } from '@casl/prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getAbilityFromStore } from 'src/common/utils/get-ability';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';
import { getUserFromStore } from 'src/common/utils/get-user';
import { EnumOrgRole } from 'src/permission/model/org-role.model';

@Injectable()
export class PostsRepo {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  createPost(args: { data: Prisma.PostCreateInput; includeAuthor?: boolean }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.post.create({
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
    return this.txHost.tx.post.update({
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

  async getPost(args: { where?: Prisma.PostWhereInput }) {
    const orgId = getOrgIdFromStore();
    const post = await this.txHost.tx.post.findFirst({
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && {
          orgId,
        }),
      },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
    });
    return post;
  }

  async getPostWithRole(args: {
    where?: Prisma.PostWhereInput;
    userId: string;
  }) {
    const orgId = getOrgIdFromStore();
    const post = await this.txHost.tx.post.findFirst({
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && {
          orgId,
        }),
      },
      include: {
        _count: { select: { comments: { where: { deletedAt: null } } } },
        users: {
          where: {
            userId: args.userId,
          },
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });
    return post;
  }

  async getPosts(args: {
    where?: Prisma.PostWhereInput;
    includeUser?: boolean;
    take?: number;
    skip?: number;
  }) {
    const orgId = getOrgIdFromStore();
    const user = getUserFromStore();
    const ability = getAbilityFromStore();
    const where = {
      ...args.where,
      deletedAt: null,
      ...(orgId && { orgId }),
      ...(ability && accessibleBy(ability).Post),
    };

    return this.txHost.withTransaction(async () => {
      return {
        posts: await this.txHost.tx.post.findMany({
          where,
          take: args.take,
          skip: args.skip,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: { select: { comments: { where: { deletedAt: null } } } },
            ...(args.includeUser &&
              user && {
                users: {
                  where: {
                    userId: user.id,
                  },
                  select: {
                    user: true,
                    role: true,
                  },
                },
              }),
          },
        }),
        total: await this.txHost.tx.post.count({
          where,
        }),
      };
    });
  }

  async getPostsWithRole(args: {
    where?: Prisma.PostWhereInput;
    take?: number;
    skip?: number;
    userId: string;
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

    return this.txHost.withTransaction(async () => {
      return {
        posts: await this.txHost.tx.post.findMany({
          where,
          take: args.take,
          skip: args.skip,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: { select: { comments: { where: { deletedAt: null } } } },
            users: {
              where: {
                userId: args.userId,
              },
              select: {
                userId: true,
                role: true,
              },
            },
          },
        }),
        total: await this.txHost.tx.post.count({
          where,
        }),
      };
    });
  }

  deletePost(args: { where: Prisma.PostWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.post.update({
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
    const usersOnPosts = await this.txHost.tx.usersOnPosts.findFirst({
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
      },
    });
    return usersOnPosts?.role || null;
  }
}
