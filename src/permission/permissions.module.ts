import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CommentsModule } from 'src/comments/comments.module';
import { PostsModule } from 'src/posts/posts.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [PostsModule, CommentsModule, CaslAbilityFactory],
  providers: [
    PermissionsService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AuthorisationModule {}
