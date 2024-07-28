import { Module } from '@nestjs/common';
import { DomainsModule } from './domains/domains.module';
import { SitesController } from './sites.controller';
import { SitesRepo } from './sites.repo';
import { SitesService } from './sites.service';

@Module({
  imports: [DomainsModule],
  providers: [SitesService, SitesRepo],
  exports: [SitesRepo],
  controllers: [SitesController],
})
export class SitesModule {}
