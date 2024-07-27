import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesRepo } from './sites.repo';
import { SitesService } from './sites.service';

@Module({
  controllers: [SitesController],
  providers: [SitesService, SitesRepo],
  exports: [SitesRepo],
})
export class SitesModule {}
