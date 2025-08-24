import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from 'src/auth/auth.module';
import { getPermissionsFromStore } from 'src/common/utils/get-permissions';
import { getUserFromStore } from 'src/common/utils/get-user';
import appConfig from 'src/config/app.config';
import { HealthModule } from 'src/health/health.module';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { PermissionsModule } from 'src/permission/permissions.module';
import { CommentsModule } from 'src/posts/comments/comments.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SitesModule } from 'src/sites/sites.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    LoggerModule.forRoot({
      exclude: ['/health'],
      pinoHttp: {
        customProps() {
          const user = getUserFromStore();
          const permissions = getPermissionsFromStore();
          return {
            ...(user && { user }),
            ...(permissions && { permissions }),
          };
        },
        redact: ['req.headers.authorization'],
        customReceivedMessage() {
          return 'request received';
        },
      },
    }),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    HealthModule,
    AuthModule,
    PermissionsModule,
    OrganisationsModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    SitesModule,
  ],
  providers: [],
})
export class AppModule {}
