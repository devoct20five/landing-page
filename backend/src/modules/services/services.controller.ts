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
import { RequirePermissions } from '@/common/decorators/permissions.decorator';

// Read routes (GET) are the client-facing service catalog browse (spec
// §1.6); every write route is admin/manager only (spec §42, §3.14).
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @RequirePermissions('services.create')
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @RequirePermissions('services.view')
  findAll(@Query() query: QueryServiceDto) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('services.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('services.edit')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('services.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }

  // -- plans ----------------------------------------------------------------

  @Post(':id/plans')
  @RequirePermissions('services.edit')
  addPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateServicePlanDto,
  ) {
    return this.servicesService.addPlan(id, dto);
  }

  @Get(':id/plans/:planId')
  @RequirePermissions('services.view')
  findPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.findPlan(id, planId);
  }

  @Patch(':id/plans/:planId')
  @RequirePermissions('services.edit')
  updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: UpdateServicePlanDto,
  ) {
    return this.servicesService.updatePlan(id, planId, dto);
  }

  @Patch(':id/plans/:planId/toggle-status')
  @RequirePermissions('services.edit')
  toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.togglePlanStatus(id, planId);
  }

  @Post(':id/plans/:planId/duplicate')
  @RequirePermissions('services.edit')
  duplicatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.duplicatePlan(id, planId);
  }

  @Delete(':id/plans/:planId')
  @RequirePermissions('services.delete')
  removePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.servicesService.removePlan(id, planId);
  }

  // -- packages / features on a plan ----------------------------------------

  @Post(':id/plans/:planId/packages')
  @RequirePermissions('services.edit')
  addPackage(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: PlanPackageDto,
  ) {
    return this.servicesService.addPackage(planId, dto);
  }

  @Delete(':id/plans/:planId/packages/:packageId')
  @RequirePermissions('services.edit')
  removePackage(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('packageId', ParseUUIDPipe) packageId: string,
  ) {
    return this.servicesService.removePackage(planId, packageId);
  }

  @Post(':id/plans/:planId/features')
  @RequirePermissions('services.edit')
  addFeature(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: PlanFeatureDto,
  ) {
    return this.servicesService.addFeature(planId, dto);
  }

  @Delete(':id/plans/:planId/features/:featureId')
  @RequirePermissions('services.edit')
  removeFeature(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('featureId', ParseUUIDPipe) featureId: string,
  ) {
    return this.servicesService.removeFeature(planId, featureId);
  }
}
