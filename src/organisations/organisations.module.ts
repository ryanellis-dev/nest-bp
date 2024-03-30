import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsRepo } from './organisations.repo';
import { OrganisationsService } from './organisations.service';

@Module({
  imports: [UsersModule],
  controllers: [OrganisationsController],
  providers: [OrganisationsService, OrganisationsRepo],
})
export class OrganisationsModule {}
