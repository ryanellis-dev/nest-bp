import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class CommentsRepo {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  createComment(args: {
    data: Omit<Prisma.CommentCreateInput, 'post'>;
    postConnect: Prisma.PostWhereUniqueInput;
    authorConnect?: Prisma.UserWhereUniqueInput;
  }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.comment.create({
      data: {
        ...args.data,
        post: {
          connect: {
            ...args.postConnect,
            ...(orgId && { orgId }),
          },
        },
        ...(args.authorConnect && {
          author: {
            connect: args.authorConnect,
          },
        }),
      },
      include: {
        author: true,
      },
    });
  }

  updateComment(args: {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.CommentUpdateInput;
  }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.comment.update({
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && {
          post: {
            orgId,
          },
        }),
      },
      data: args.data,
      include: {
        author: true,
      },
    });
  }

  deleteComment(args: { where: Prisma.CommentWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.comment.update({
      where: {
        ...args.where,
        deletedAt: null,
        ...(orgId && {
          post: {
            orgId,
          },
        }),
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getPostComments(args: {
    where?: Prisma.PostWhereInput;
    take?: number;
    skip?: number;
  }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.withTransaction(async () => {
      const postWhere = {
        ...args.where,
        deletedAt: null,
        ...(orgId && {
          orgId,
        }),
      };
      return {
        comments: (
          await this.txHost.tx.post.findFirst({
            where: postWhere,
            select: {
              comments: {
                where: {
                  deletedAt: null,
                },
                include: {
                  author: true,
                },
                take: args.take,
                skip: args.skip,
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          })
        )?.comments,
        total: await this.txHost.tx.comment.count({
          where: {
            post: postWhere,
            deletedAt: null,
          },
        }),
      };
    });
  }

  getComment(args: { where: Prisma.CommentWhereUniqueInput }) {
    const orgId = getOrgIdFromStore();
    return this.txHost.tx.comment.findFirst({
      where: { ...args.where, ...(orgId && { post: { orgId } }) },
      include: { author: true },
    });
  }
}
