import { Module } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsController } from './comments.controller';
import { CommentsRepo } from './comments.repo';
import { CommentsService } from './comments.service';

@Module({
  imports: [PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepo],
})
export class CommentsModule {}
