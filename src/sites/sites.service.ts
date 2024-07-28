import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { SiteParamsDto } from './dto/site-params.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { ManySites, Site } from './model/site.model';
import { SitesRepo } from './sites.repo';

@Injectable()
export class SitesService {
  constructor(private sitesRepo: SitesRepo) {}

  async createSite(data: CreateSiteDto): Promise<Site> {
    return new Site(await this.sitesRepo.createSite({ data }));
  }

  async updateSite(
    { siteId }: SiteParamsDto,
    data: UpdateSiteDto,
  ): Promise<Site> {
    return new Site(
      await this.sitesRepo.updateSite({ where: { id: siteId }, data }),
    );
  }

  async getSites(): Promise<ManySites> {
    return {
      results: (await this.sitesRepo.getSites()).map((s) => new Site(s)),
    };
  }

  async getSite({ siteId }: SiteParamsDto): Promise<Site> {
    const site = await this.sitesRepo.getSite({ where: { id: siteId } });
    if (!site) throw new NotFoundException();
    return new Site(site);
  }
}
