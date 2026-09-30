import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import {
  CreateServicePlanDto,
  PlanFeatureDto,
  PlanPackageDto,
} from './dto/create-service-plan.dto';
import { UpdateServicePlanDto } from './dto/update-service-plan.dto';

// NOTE: read routes (GET) are safe for the client catalog browse (1.6);
// gate every write route behind an admin/manager guard (3.14) once auth
// is wired in.
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryServiceDto) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }

  // -- plans ----------------------------------------------------------------

  @Post(':id/plans')
  addPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateServicePlanDto,
  ) {
    return this.servicesService.addPlan(id, dto);
  }

  @Get(':id/plans/:planId')
  findPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.findPlan(id, planId);
  }

  @Patch(':id/plans/:planId')
  updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: UpdateServicePlanDto,
  ) {
    return this.servicesService.updatePlan(id, planId, dto);
  }

  @Patch(':id/plans/:planId/toggle-status')
  toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.togglePlanStatus(id, planId);
  }

  @Post(':id/plans/:planId/duplicate')
  duplicatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.duplicatePlan(id, planId);
  }

  @Delete(':id/plans/:planId')
  removePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.removePlan(id, planId);
  }

  // -- packages / features on a plan ----------------------------------------

  @Post(':id/plans/:planId/packages')
  addPackage(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: PlanPackageDto,
  ) {
    return this.servicesService.addPackage(planId, dto);
  }

  @Delete(':id/plans/:planId/packages/:packageId')
  removePackage(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('packageId', ParseUUIDPipe) packageId: string,
  ) {
    return this.servicesService.removePackage(planId, packageId);
  }

  @Post(':id/plans/:planId/features')
  addFeature(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: PlanFeatureDto,
  ) {
    return this.servicesService.addFeature(planId, dto);
  }

  @Delete(':id/plans/:planId/features/:featureId')
  removeFeature(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('featureId', ParseUUIDPipe) featureId: string,
  ) {
    return this.servicesService.removeFeature(planId, featureId);
  }
}
