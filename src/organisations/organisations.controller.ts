import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateCurrentOrgDto } from './dto/update-current-org.dto';
import { Organisation } from './model/organisation.model';
import { OrganisationsService } from './organisations.service';

@ApiTags('organisations')
@ApiBearerAuth()
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  createOrganisation(@Body() data: CreateOrganisationDto) {
    return this.organisationsService.createOrganisation(data);
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
