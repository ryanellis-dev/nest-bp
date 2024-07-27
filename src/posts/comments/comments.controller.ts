import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Require } from 'src/common/decorators/require-permissions.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Action } from 'src/permission/model/action.model';
import { Permission } from 'src/permission/model/permission.model';
import { ResourceType } from 'src/permission/model/resources.model';
import { PostParamsDto } from 'src/posts/dto/post-params.dto';
import { CommentsService } from './comments.service';
import { CommentParamsDto } from './dto/comment-params.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Require(new Permission(Action.Read, ResourceType.Post))
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @Require(new Permission(Action.Create, ResourceType.Comment))
  createComment(
    @Param() params: PostParamsDto,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentsService.createComment(params.postId, data);
  }

  @Patch('/:commentId')
  @Require(new Permission(Action.Update, ResourceType.Comment))
  updateComment(
    @Param() params: CommentParamsDto,
    @Body() data: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(
      params.postId,
      params.commentId,
      data,
    );
  }

  @Delete('/:commentId')
  @Require(new Permission(Action.Delete, ResourceType.Comment))
  deleteComment(@Param() params: CommentParamsDto) {
    return this.commentsService.deleteComment(params.postId, params.commentId);
  }

  @Get()
  @Require(new Permission(Action.Read, ResourceType.Comment))
  getComments(
    @Param() params: PostParamsDto,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.commentsService.getComments(params.postId, pagination);
  }
}
