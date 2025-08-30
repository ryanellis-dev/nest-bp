import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BypassAuth } from 'src/common/decorators/bypass-auth.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateCurrentOrgDto } from './dto/update-current-org.dto';
import { Organisation } from './model/organisation.model';
import { OrganisationsService } from './organisations.service';

//TODO: Endpoints need updating to reflect many-to-many model
@ApiTags('organisations')
@ApiBearerAuth()
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  createOrganisation(@Body() data: CreateOrganisationDto) {
    return this.organisationsService.createOrganisation(data);
  }

  @Get()
  @BypassAuth()
  getOrganisations(
    @Query() pagination: PaginationQueryDto,
    @Query() search: SearchQueryDto,
  ) {
    return this.organisationsService.getOrganisations(pagination, search);
  }

  @Get('/current')
  getCurrentOrganisation() {
    return this.organisationsService.getCurrentOrganisation();
  }

  @Put('/current')
  @ApiResponse({ status: 200, type: Organisation })
  updateCurrentOrganisation(@Body() data: UpdateCurrentOrgDto) {
    return this.organisationsService.updateCurrentOrganisation(data);
  }
}
