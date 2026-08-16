import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }

  // -- plans ----------------------------------------------------------------

  @Post(':id/plans')
  addPlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateServicePlanDto,
  ) {
    return this.servicesService.addPlan(id, dto);
  }

  @Get(':id/plans/:planId')
  findPlan(
    @Param('id', ParseIntPipe) id: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    return this.servicesService.findPlan(id, planId);
  }

  @Patch(':id/plans/:planId')
  updatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Param('planId', ParseIntPipe) planId: number,
    @Body() dto: UpdateServicePlanDto,
  ) {
    return this.servicesService.updatePlan(id, planId, dto);
  }

  @Patch(':id/plans/:planId/toggle-status')
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    return this.servicesService.togglePlanStatus(id, planId);
  }

  @Post(':id/plans/:planId/duplicate')
  duplicatePlan(
    @Param('id', ParseIntPipe) id: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    return this.servicesService.duplicatePlan(id, planId);
  }

  @Delete(':id/plans/:planId')
  removePlan(
    @Param('id', ParseIntPipe) id: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    return this.servicesService.removePlan(id, planId);
  }

  // -- packages / features on a plan ----------------------------------------

  @Post(':id/plans/:planId/packages')
  addPackage(
    @Param('planId', ParseIntPipe) planId: number,
    @Body() dto: PlanPackageDto,
  ) {
    return this.servicesService.addPackage(planId, dto);
  }

  @Delete(':id/plans/:planId/packages/:packageId')
  removePackage(
    @Param('planId', ParseIntPipe) planId: number,
    @Param('packageId', ParseIntPipe) packageId: number,
  ) {
    return this.servicesService.removePackage(planId, packageId);
  }

  @Post(':id/plans/:planId/features')
  addFeature(
    @Param('planId', ParseIntPipe) planId: number,
    @Body() dto: PlanFeatureDto,
  ) {
    return this.servicesService.addFeature(planId, dto);
  }

  @Delete(':id/plans/:planId/features/:featureId')
  removeFeature(
    @Param('planId', ParseIntPipe) planId: number,
    @Param('featureId', ParseIntPipe) featureId: number,
  ) {
    return this.servicesService.removeFeature(planId, featureId);
  }
}
