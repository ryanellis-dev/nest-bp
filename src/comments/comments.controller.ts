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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  createComment(
    @Param('postId') postId: string,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, data);
  }

  @Patch('/:id')
  updateComment(
    @Param('postId') postId: string,
    @Param('id') id: string,
    @Body() data: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(postId, id, data);
  }

  @Delete('/:id')
  deleteComment(@Param('postId') postId: string, @Param('id') id: string) {
    return this.commentsService.deleteComment(postId, id);
  }

  @Get()
  getComments(@Param('postId') postId: string) {
    return this.commentsService.getComments(postId);
  }
}
