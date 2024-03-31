import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Logger,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import {
  PrismaModule,
  loggingMiddleware,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModule } from 'src/comments/comments.module';
import appConfig from 'src/config/app.config';
import { HealthModule } from 'src/health/health.module';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [appConfig] }),
    LoggerModule.forRoot({
      exclude: ['/health'],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    PostsModule,
    CommentsModule,
    UsersModule,
    AuthModule,
    OrganisationsModule,
    HealthModule,
  ],
  providers: [
    providePrismaClientExceptionFilter({
      P2000: {
        statusCode: HttpStatus.BAD_REQUEST,
        errorMessage: new BadRequestException().message,
      },
      P2002: {
        statusCode: HttpStatus.CONFLICT,
        errorMessage: new ConflictException().message,
      },
      P2025: {
        statusCode: HttpStatus.NOT_FOUND,
        errorMessage: new NotFoundException().message,
      },
    }),
  ],
})
export class AppModule {}
