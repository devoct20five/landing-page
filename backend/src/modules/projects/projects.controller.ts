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

// NOTE: Wire in your auth/RBAC guards per route (admin-only for create/
// delete/assign; client/staff routes should additionally scope by the
// requester's own clientId/staffId) — omitted so the module drops in
// regardless of your auth setup.
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProjectDto) {
    return this.projectsService.findAll(query);
  }

  @Get('attention')
  needingAttention(@Query('clientId') clientId?: string) {
    return this.projectsService.needingAttention(
      clientId ? parseInt(clientId, 10) : undefined,
    );
  }

  @Get('dashboard/:clientId')
  clientDashboard(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.projectsService.clientDashboardStats(clientId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  // -- services involved ---------------------------------------------------

  @Post(':id/services')
  linkServices(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: LinkServicesDto,
  ) {
    return this.projectsService.linkServices(id, dto);
  }

  @Delete(':id/services/:serviceId')
  unlinkService(
    @Param('id', ParseIntPipe) id: number,
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    return this.projectsService.unlinkService(id, serviceId);
  }

  // -- team assignment ------------------------------------------------------

  @Post(':id/team')
  assignTeamMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTeamMemberDto,
  ) {
    return this.projectsService.assignTeamMember(id, dto);
  }

  @Delete(':id/team/:staffId')
  removeTeamMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    return this.projectsService.removeTeamMember(id, staffId);
  }

  // -- deliverables ----------------------------------------------------------

  @Post(':id/deliverables')
  addDeliverable(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDeliverableDto,
  ) {
    return this.projectsService.addDeliverable(id, dto);
  }

  @Get(':id/deliverables')
  listDeliverables(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.listDeliverables(id);
  }

  @Patch(':id/deliverables/:deliverableId')
  updateDeliverable(
    @Param('id', ParseIntPipe) id: number,
    @Param('deliverableId', ParseIntPipe) deliverableId: number,
    @Body() dto: UpdateDeliverableDto,
  ) {
    return this.projectsService.updateDeliverable(id, deliverableId, dto);
  }

  @Delete(':id/deliverables/:deliverableId')
  removeDeliverable(
    @Param('id', ParseIntPipe) id: number,
    @Param('deliverableId', ParseIntPipe) deliverableId: number,
  ) {
    return this.projectsService.removeDeliverable(id, deliverableId);
  }
}
