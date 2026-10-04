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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import {
  AssignTeamMemberDto,
  LinkServicesDto,
} from './dto/assign-team-member.dto';
import {
  CreateDeliverableDto,
  UpdateDeliverableDto,
} from './dto/deliverable.dto';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { RequestUser } from '@/modules/auth/types/authenticated-user.type';

// Every route below is reachable by any authenticated user unless a
// @RequirePermissions() is present — see docs/00_CURRENT_STATE_AUDIT.md §2.
// Permission slugs match database/helpers/permission-catalog.ts. Beyond
// the permission gate, ProjectsService further scopes results/access to
// what the caller's client/staff assignment actually covers (§3/§11) via
// AccessControlService — a permission alone ("projects.view") only says
// *that* someone can view projects, not *which* ones.
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @RequirePermissions('projects.create')
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @RequirePermissions('projects.view')
  findAll(@Query() query: QueryProjectDto, @CurrentUser() user: RequestUser) {
    return this.projectsService.findAll(query, user);
  }

  @Get('attention')
  @RequirePermissions('projects.view')
  needingAttention(
    @Query('clientId') clientId: string | undefined,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.needingAttention(clientId, user);
  }

  @Get('dashboard/:clientId')
  @RequirePermissions('projects.view')
  clientDashboard(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.clientDashboardStats(clientId, user);
  }

  @Get(':id')
  @RequirePermissions('projects.view')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  @RequirePermissions('projects.edit')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions('projects.delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.remove(id, user);
  }

  // -- services involved ---------------------------------------------------

  @Post(':id/services')
  @RequirePermissions('projects.edit')
  linkServices(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: LinkServicesDto,
  ) {
    return this.projectsService.linkServices(id, dto);
  }

  @Delete(':id/services/:serviceId')
  @RequirePermissions('projects.edit')
  unlinkService(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.projectsService.unlinkService(id, serviceId);
  }

  // -- team assignment ------------------------------------------------------

  @Post(':id/team')
  @RequirePermissions('team.edit')
  assignTeamMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTeamMemberDto,
  ) {
    return this.projectsService.assignTeamMember(id, dto);
  }

  @Delete(':id/team/:staffId')
  @RequirePermissions('team.edit')
  removeTeamMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
  ) {
    return this.projectsService.removeTeamMember(id, staffId);
  }

  // -- deliverables ----------------------------------------------------------

  @Post(':id/deliverables')
  @RequirePermissions('deliverables.create')
  addDeliverable(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateDeliverableDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.addDeliverable(id, dto, user);
  }

  @Get(':id/deliverables')
  @RequirePermissions('deliverables.view')
  listDeliverables(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.listDeliverables(id, user);
  }

  @Patch(':id/deliverables/:deliverableId')
  @RequirePermissions('deliverables.edit')
  updateDeliverable(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('deliverableId', ParseUUIDPipe) deliverableId: string,
    @Body() dto: UpdateDeliverableDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.updateDeliverable(id, deliverableId, dto, user);
  }

  @Delete(':id/deliverables/:deliverableId')
  @RequirePermissions('deliverables.delete')
  removeDeliverable(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('deliverableId', ParseUUIDPipe) deliverableId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.removeDeliverable(id, deliverableId, user);
  }
}
