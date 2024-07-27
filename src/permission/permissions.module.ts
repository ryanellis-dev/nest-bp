import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CommentsModule } from 'src/posts/comments/comments.module';
import { PostsModule } from 'src/posts/posts.module';
import { SitesModule } from 'src/sites/sites.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CaslAbilityFactory } from './casl/casl-ability.factory/casl-ability.factory';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [PostsModule, CommentsModule, SitesModule],
  providers: [
    PermissionsService,
    CaslAbilityFactory,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class PermissionsModule {}
