import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostParamsDto } from 'src/posts/dto/post-params.dto';
import { CommentsService } from './comments.service';
import { CommentParamsDto } from './dto/comment-params.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  createComment(
    @Param() params: PostParamsDto,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentsService.createComment(params.postId, data);
  }

  @Patch('/:commentId')
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
  deleteComment(@Param() params: CommentParamsDto) {
    return this.commentsService.deleteComment(params.postId, params.commentId);
  }

  @Get()
  getComments(@Param() params: PostParamsDto) {
    return this.commentsService.getComments(params.postId);
  }
}
