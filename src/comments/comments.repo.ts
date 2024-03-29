import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CommentsRepo {
  constructor(private prisma: PrismaService) {}

  createComment(args: { data: Prisma.CommentCreateInput }) {
    return this.prisma.comment.create({
      data: args.data,
    });
  }

  updateComment(args: {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.CommentUpdateInput;
  }) {
    return this.prisma.comment.update({
      where: {
        ...args.where,
        deletedAt: null,
      },
      data: args.data,
    });
  }

  deleteComment(args: { where: Prisma.CommentWhereUniqueInput }) {
    return this.prisma.comment.update({
      where: {
        ...args.where,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
