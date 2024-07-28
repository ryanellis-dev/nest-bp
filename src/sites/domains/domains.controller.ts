import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Require } from 'src/common/decorators/require-permissions.decorator';
import { Action } from 'src/permission/model/action.model';
import { Permission } from 'src/permission/model/permission.model';
import { ResourceType } from 'src/permission/model/resources.model';
import { SiteParamsDto } from '../dto/site-params.dto';
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';

@ApiTags('domains')
@ApiBearerAuth()
@Require(new Permission(Action.Read, ResourceType.Post))
@Controller('sites/:siteId/domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @Post()
  createDomain(@Param() params: SiteParamsDto, @Body() data: CreateDomainDto) {
    return this.domainsService.createDomain(params, data);
  }

  @Get()
  getDomains(@Param() params: SiteParamsDto) {
    return this.domainsService.getDomains(params);
  }
}
