import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Require } from 'src/common/decorators/require-permissions.decorator';
import { Action } from 'src/permission/model/action.model';
import { Permission } from 'src/permission/model/permission.model';
import { ResourceType } from 'src/permission/model/resources.model';
import { CreateSiteDto } from './dto/create-site.dto';
import { SiteParamsDto } from './dto/site-params.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SitesService } from './sites.service';

@ApiTags('sites')
@ApiBearerAuth()
@Controller('sites')
export class SitesController {
  constructor(private sitesService: SitesService) {}

  @Post()
  @Require(new Permission(Action.Create, ResourceType.Site))
  createSite(@Body() data: CreateSiteDto) {
    return this.sitesService.createSite(data);
  }

  @Patch(':siteId')
  @Require(new Permission(Action.Update, ResourceType.Site))
  updateSite(@Param() params: SiteParamsDto, @Body() data: UpdateSiteDto) {
    return this.sitesService.updateSite(params, data);
  }

  @Get()
  @Require(new Permission(Action.Read, ResourceType.Site))
  getSites() {
    return this.sitesService.getSites();
  }

  @Get(':siteId')
  getSite(@Param() params: SiteParamsDto) {
    return this.sitesService.getSite(params);
  }
}
