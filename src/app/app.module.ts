import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Logger,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import {
  PrismaModule,
  loggingMiddleware,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { CommentsModule } from 'src/comments/comments.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
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
