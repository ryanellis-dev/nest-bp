import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepo } from './users.repo';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepo],
  exports: [UsersRepo],
})
export class UsersModule {}
