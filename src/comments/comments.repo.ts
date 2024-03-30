import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { getOrgIdFromStore } from 'src/common/utils/get-orgId';

@Injectable()
export class CommentsRepo {
  constructor(private prisma: PrismaService) {}

  createComment(args: {
    data: Omit<Prisma.CommentCreateInput, 'post'>;
    postConnect: Prisma.PostWhereUniqueInput;
    authorConnect?: Prisma.UserWhereUniqueInput;
  }) {
    const orgId = getOrgIdFromStore();
    return this.prisma.comment.create({
      data: {
        ...args.data,
        post: {
          connect: { ...args.postConnect, ...(orgId && { orgId }) },
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
    return this.prisma.comment.update({
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
    return this.prisma.comment.update({
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
}