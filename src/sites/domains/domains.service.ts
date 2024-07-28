import { Injectable } from '@nestjs/common';
import { SiteParamsDto } from '../dto/site-params.dto';
import { DomainsRepo } from './domains.repo';
import { CreateDomainDto } from './dto/create-domain.dto';
import { Domain, ManyDomains } from './model/domain.model';

@Injectable()
export class DomainsService {
  constructor(private domainsRepo: DomainsRepo) {}

  async createDomain(
    params: SiteParamsDto,
    data: CreateDomainDto,
  ): Promise<Domain> {
    return new Domain(
      await this.domainsRepo.createDomain({ data, siteId: params.siteId }),
    );
  }

  async getDomains(params: SiteParamsDto): Promise<ManyDomains> {
    return {
      results: (
        await this.domainsRepo.getDomains({ siteId: params.siteId })
      ).map((d) => new Domain(d)),
    };
  }
}
