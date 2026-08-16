import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Project } from './models/project.model';
import { ProjectTeamMember } from './models/project-team-member.model';
import { Deliverable } from './models/deliverable.model';
import { Client } from '../clients/models/client.model';
import { Service } from '../services/models/service.model';
import { User } from '../users/models/user.model';
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
import { DeliverableStatus, ProjectStatus } from '@/common/enums/index.enum';

const DETAIL_INCLUDES = [
  { model: Client },
  { model: Service, as: 'services', through: { attributes: [] } },
  { model: User, as: 'teamMembers', through: { attributes: [] } },
  { model: Deliverable },
];

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project) private readonly projectModel: typeof Project,
    @InjectModel(ProjectTeamMember)
    private readonly teamMemberModel: typeof ProjectTeamMember,
    @InjectModel(Deliverable)
    private readonly deliverableModel: typeof Deliverable,
  ) {}

  // ---------------------------------------------------------------------
  // Project CRUD (admin 3.3 full management; client/staff read via filters)
  // ---------------------------------------------------------------------

  async create(dto: CreateProjectDto): Promise<Project> {
    const { serviceIds, teamMemberIds, ...rest } = dto;

    const project = await this.projectModel.create({
      ...rest,
      teamSize: teamMemberIds?.length ?? rest.teamSize ?? 0,
    } as any);

    if (serviceIds?.length) {
      await (project as any).$set('services', serviceIds);
    }
    if (teamMemberIds?.length) {
      await (project as any).$set('teamMembers', teamMemberIds);
    }

    return this.findOne(project.id);
  }

  /**
   * Shared list endpoint backing:
   *  - Admin 3.3 (all projects, filter by client/status)
   *  - Client 1.2 (filter by the logged-in client's clientId)
   *  - Staff 2.2 (filter by staffId via project_team_members)
   */
  async findAll(query: QueryProjectDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.clientId) where.clientId = query.clientId;
    if (query.search) where.name = { [Op.like]: `%${query.search}%` };

    const include: any[] = [
      { model: Client },
      { model: Service, as: 'services', through: { attributes: [] } },
    ];

    if (query.staffId) {
      include.push({
        model: User,
        as: 'teamMembers',
        through: { attributes: [] },
        where: { id: query.staffId },
        required: true,
      });
    }

    const { rows, count } = await this.projectModel.findAndCountAll({
      where,
      include,
      limit,
      offset: (page - 1) * limit,
      order: [['updatedAt', 'DESC']],
      distinct: true, // required for correct count() with hasMany/belongsToMany includes
    });

    return { data: rows, total: count, page, limit };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectModel.findByPk(id, {
      include: DETAIL_INCLUDES as any,
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    await project.update(dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await project.destroy();
  }

  // ---------------------------------------------------------------------
  // Services involved (project_services)
  // ---------------------------------------------------------------------

  async linkServices(id: number, dto: LinkServicesDto): Promise<Project> {
    const project = await this.findOne(id);
    await (project as any).$add('services', dto.serviceIds);
    return this.findOne(id);
  }

  async unlinkService(id: number, serviceId: number): Promise<Project> {
    const project = await this.findOne(id);
    await (project as any).$remove('services', serviceId);
    return this.findOne(id);
  }

  // ---------------------------------------------------------------------
  // Team assignment (project_team_members)
  // ---------------------------------------------------------------------

  async assignTeamMember(
    id: number,
    dto: AssignTeamMemberDto,
  ): Promise<Project> {
    await this.findOne(id);
    await this.teamMemberModel.upsert({
      projectId: id,
      staffId: dto.staffId,
      roleOnProject: dto.roleOnProject,
      assignedAt: new Date(),
    } as any);
    await this.syncTeamSize(id);
    return this.findOne(id);
  }

  async removeTeamMember(id: number, staffId: number): Promise<Project> {
    await this.findOne(id);
    await this.teamMemberModel.destroy({ where: { projectId: id, staffId } });
    await this.syncTeamSize(id);
    return this.findOne(id);
  }

  private async syncTeamSize(projectId: number): Promise<void> {
    const teamSize = await this.teamMemberModel.count({
      where: { projectId },
    });
    await this.projectModel.update({ teamSize }, { where: { id: projectId } });
  }

  // ---------------------------------------------------------------------
  // Deliverables (project detail: "deliverables completed/total")
  // ---------------------------------------------------------------------

  async addDeliverable(
    projectId: number,
    dto: CreateDeliverableDto,
  ): Promise<Deliverable> {
    await this.findOne(projectId);
    return this.deliverableModel.create({ ...dto, projectId } as any);
  }

  async listDeliverables(projectId: number): Promise<Deliverable[]> {
    await this.findOne(projectId);
    return this.deliverableModel.findAll({ where: { projectId } });
  }

  async updateDeliverable(
    projectId: number,
    deliverableId: number,
    dto: UpdateDeliverableDto,
  ): Promise<Deliverable> {
    const deliverable = await this.deliverableModel.findOne({
      where: { id: deliverableId, projectId },
    });
    if (!deliverable) throw new NotFoundException('Deliverable not found');
    await deliverable.update(dto);
    await this.recalculateProgress(projectId);
    return deliverable;
  }

  async removeDeliverable(
    projectId: number,
    deliverableId: number,
  ): Promise<void> {
    const deliverable = await this.deliverableModel.findOne({
      where: { id: deliverableId, projectId },
    });
    if (!deliverable) throw new NotFoundException('Deliverable not found');
    await deliverable.destroy();
    await this.recalculateProgress(projectId);
  }

  /** progress_percent = share of deliverables approved/delivered. */
  private async recalculateProgress(projectId: number): Promise<void> {
    const deliverables = await this.deliverableModel.findAll({
      where: { projectId },
    });
    if (!deliverables.length) return;

    const done = deliverables.filter((d) =>
      [DeliverableStatus.APPROVED, DeliverableStatus.DELIVERED].includes(
        d.status,
      ),
    ).length;
    const progressPercent = Math.round((done / deliverables.length) * 100);

    await this.projectModel.update(
      { progressPercent },
      { where: { id: projectId } },
    );
  }

  // ---------------------------------------------------------------------
  // Dashboard helpers
  // ---------------------------------------------------------------------

  /** Client 1.1 summary stats: active / in-progress / needs-input / completed. */
  async clientDashboardStats(clientId: number) {
    const projects = await this.projectModel.findAll({ where: { clientId } });
    return {
      active: projects.filter((p) =>
        [ProjectStatus.IN_PROGRESS, ProjectStatus.CLIENT_REVIEW].includes(
          p.status,
        ),
      ).length,
      inProgress: projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS)
        .length,
      needsInput: projects.filter(
        (p) => p.status === ProjectStatus.CLIENT_REVIEW,
      ).length,
      completed: projects.filter((p) => p.status === ProjectStatus.COMPLETED)
        .length,
    };
  }

  /** Projects needing attention: blocked / review pending / deadline soon. */
  async needingAttention(clientId?: number) {
    const soon = new Date();
    soon.setDate(soon.getDate() + 7);

    const where: any = {
      [Op.or]: [
        { status: ProjectStatus.BLOCKED },
        { status: ProjectStatus.CLIENT_REVIEW },
        { deadline: { [Op.lte]: soon.toISOString().slice(0, 10) } },
      ],
    };
    if (clientId) where.clientId = clientId;

    return this.projectModel.findAll({ where, include: [Client] });
  }
}
