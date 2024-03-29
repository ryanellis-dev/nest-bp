import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsRepo } from './posts.repo';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsService, PostsRepo],
  controllers: [PostsController],
  exports: [PostsRepo],
})
export class PostsModule {}
