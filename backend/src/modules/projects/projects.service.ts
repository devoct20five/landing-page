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
import { UserType } from '@/common/enums/user-type.enum';
import { AccessControlService } from '@/common/access-control/access-control.service';
import type { RequestUser } from '@/modules/auth/types/authenticated-user.type';

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
    private readonly accessControl: AccessControlService,
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

    return this.findOneUnscoped(project.id);
  }

  /**
   * Shared list endpoint backing:
   *  - Admin 3.3 (all projects, filter by client/status)
   *  - Client 1.2 (own projects only — clientId is forced from the JWT,
   *    never taken from the query string: docs/00_CURRENT_STATE_AUDIT.md
   *    §3 — this used to trust query.clientId outright)
   *  - Staff 2.2 (own assignments only, via project_team_members)
   */
  async findAll(query: QueryProjectDto, user: RequestUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.search) where.name = { [Op.like]: `%${query.search}%` };

    if (user.userType === UserType.CLIENT) {
      // A client can only ever see their own projects — ignore whatever
      // (if anything) query.clientId says and use the tenant resolved at
      // login instead.
      where.clientId = user.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (user.roleSlug === 'staff') {
      const assignedIds = await this.accessControl.assignedProjectIds(user.id);
      where.id = { [Op.in]: assignedIds };
      // admin/manager: no extra restriction beyond an optional explicit
      // clientId filter, which is safe for them (permission-gated route).
    } else if (query.clientId) {
      where.clientId = query.clientId;
    }

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

  /** Fetches a project with no access check — internal use only (after create, etc). */
  private async findOneUnscoped(id: string): Promise<Project> {
    const project = await this.projectModel.findByPk(id, {
      include: DETAIL_INCLUDES as any,
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async findOne(id: string, user: RequestUser): Promise<Project> {
    const project = await this.findOneUnscoped(id);
    await this.accessControl.assertProjectAccess(user, project);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, user: RequestUser): Promise<Project> {
    const project = await this.findOneUnscoped(id);
    await this.accessControl.assertProjectAccess(user, project);
    await project.update(dto);
    return this.findOneUnscoped(id);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const project = await this.findOneUnscoped(id);
    await this.accessControl.assertProjectAccess(user, project);
    await project.destroy();
  }

  // ---------------------------------------------------------------------
  // Services involved (project_services)
  // ---------------------------------------------------------------------

  async linkServices(id: string, dto: LinkServicesDto): Promise<Project> {
    const project = await this.findOneUnscoped(id);
    await (project as any).$add('services', dto.serviceIds);
    return this.findOneUnscoped(id);
  }

  async unlinkService(id: string, serviceId: string): Promise<Project> {
    const project = await this.findOneUnscoped(id);
    await (project as any).$remove('services', serviceId);
    return this.findOneUnscoped(id);
  }

  // ---------------------------------------------------------------------
  // Team assignment (project_team_members)
  // ---------------------------------------------------------------------

  async assignTeamMember(
    id: string,
    dto: AssignTeamMemberDto,
  ): Promise<Project> {
    await this.findOneUnscoped(id);
    await this.teamMemberModel.upsert({
      projectId: id,
      staffId: dto.staffId,
      roleOnProject: dto.roleOnProject,
      assignedAt: new Date(),
    } as any);
    await this.syncTeamSize(id);
    return this.findOneUnscoped(id);
  }

  async removeTeamMember(id: string, staffId: string): Promise<Project> {
    await this.findOneUnscoped(id);
    await this.teamMemberModel.destroy({ where: { projectId: id, staffId } });
    await this.syncTeamSize(id);
    return this.findOneUnscoped(id);
  }

  private async syncTeamSize(projectId: string): Promise<void> {
    const teamSize = await this.teamMemberModel.count({
      where: { projectId },
    });
    await this.projectModel.update({ teamSize }, { where: { id: projectId } });
  }

  // ---------------------------------------------------------------------
  // Deliverables (project detail: "deliverables completed/total")
  // ---------------------------------------------------------------------

  async addDeliverable(
    projectId: string,
    dto: CreateDeliverableDto,
    user: RequestUser,
  ): Promise<Deliverable> {
    const project = await this.findOneUnscoped(projectId);
    await this.accessControl.assertProjectAccess(user, project);
    return this.deliverableModel.create({ ...dto, projectId } as any);
  }

  async listDeliverables(projectId: string, user: RequestUser): Promise<Deliverable[]> {
    const project = await this.findOneUnscoped(projectId);
    await this.accessControl.assertProjectAccess(user, project);
    return this.deliverableModel.findAll({ where: { projectId } });
  }

  async updateDeliverable(
    projectId: string,
    deliverableId: string,
    dto: UpdateDeliverableDto,
    user: RequestUser,
  ): Promise<Deliverable> {
    const project = await this.findOneUnscoped(projectId);
    await this.accessControl.assertProjectAccess(user, project);
    const deliverable = await this.deliverableModel.findOne({
      where: { id: deliverableId, projectId },
    });
    if (!deliverable) throw new NotFoundException('Deliverable not found');
    await deliverable.update(dto);
    await this.recalculateProgress(projectId);
    return deliverable;
  }

  async removeDeliverable(
    projectId: string,
    deliverableId: string,
    user: RequestUser,
  ): Promise<void> {
    const project = await this.findOneUnscoped(projectId);
    await this.accessControl.assertProjectAccess(user, project);
    const deliverable = await this.deliverableModel.findOne({
      where: { id: deliverableId, projectId },
    });
    if (!deliverable) throw new NotFoundException('Deliverable not found');
    await deliverable.destroy();
    await this.recalculateProgress(projectId);
  }

  /** progress_percent = share of deliverables approved/delivered. */
  private async recalculateProgress(projectId: string): Promise<void> {
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
  async clientDashboardStats(clientId: string, user: RequestUser) {
    this.accessControl.assertClientAccess(user, clientId);
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
  async needingAttention(clientId: string | undefined, user: RequestUser) {
    const soon = new Date();
    soon.setDate(soon.getDate() + 7);

    const where: any = {
      [Op.or]: [
        { status: ProjectStatus.BLOCKED },
        { status: ProjectStatus.CLIENT_REVIEW },
        { deadline: { [Op.lte]: soon.toISOString().slice(0, 10) } },
      ],
    };

    if (user.userType === UserType.CLIENT) {
      where.clientId = user.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (user.roleSlug === 'staff') {
      const assignedIds = await this.accessControl.assignedProjectIds(user.id);
      where.id = { [Op.in]: assignedIds };
    } else if (clientId) {
      where.clientId = clientId;
    }

    return this.projectModel.findAll({ where, include: [Client] });
  }
}
