import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DomainsRepo } from './domains.repo';
import { DomainsService } from './domains.service';

@Module({
  providers: [DomainsService, DomainsRepo],
  exports: [DomainsRepo],
  controllers: [DomainsController],
})
export class DomainsModule {}
