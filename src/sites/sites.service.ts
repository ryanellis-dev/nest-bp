import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { ManySites, Site } from './model/site.model';
import { SitesRepo } from './sites.repo';

@Injectable()
export class SitesService {
  constructor(private sitesRepo: SitesRepo) {}

  async createSite(data: CreateSiteDto): Promise<Site> {
    return new Site(await this.sitesRepo.createSite({ data }));
  }

  async getSites(): Promise<ManySites> {
    return {
      results: (await this.sitesRepo.getSites()).map((s) => new Site(s)),
    };
  }
}
