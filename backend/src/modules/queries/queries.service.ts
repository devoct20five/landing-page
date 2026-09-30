import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Client } from '../clients/models/client.model';
import { Project } from '../projects/models/project.model';
import { User } from '../users/models/user.model';
import { AssignQueryDto } from './dto/assign-query.dto';
import { CreateQueryDto } from './dto/create-query.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { SupportQuery } from './models/query.model';

const INCLUDE = [
  { model: Client, attributes: ['id', 'name', 'short_name'] },
  { model: Project, attributes: ['id', 'name'] },
  {
    model: User,
    as: 'assignee',
    attributes: ['id', 'first_name', 'last_name', 'avatar_url'],
  },
];

@Injectable()
export class QueriesService {
  constructor(
    @InjectModel(SupportQuery) private readonly queryModel: typeof SupportQuery,
  ) {}

  async create(dto: CreateQueryDto): Promise<SupportQuery> {
    const query = await this.queryModel.create({ ...dto } as any);
    return this.findOne(query.id);
  }

  async findAll(filter: QueryFilterDto) {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    const where: any = {};

    if (filter.status) where.status = filter.status;
    if (filter.priority) where.priority = filter.priority;
    if (filter.client_id) where.client_id = filter.client_id;
    if (filter.project_id) where.project_id = filter.project_id;
    if (filter.assigned_to) where.assigned_to = filter.assigned_to;
    if (filter.search) {
      where[Op.or] = [
        { subject: { [Op.like]: `%${filter.search}%` } },
        { message: { [Op.like]: `%${filter.search}%` } },
      ];
    }

    const { rows, count } = await this.queryModel.findAndCountAll({
      where,
      include: INCLUDE,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(id: string): Promise<SupportQuery> {
    const query = await this.queryModel.findByPk(id, { include: INCLUDE });
    if (!query) throw new NotFoundException(`Query #${id} not found`);
    return query;
  }

  async update(id: string, dto: UpdateQueryDto): Promise<SupportQuery> {
    const query = await this.findOne(id);
    const patch: any = { ...dto };

    // Auto-stamp resolved_at when status flips to resolved/closed.
    if (
      dto.status &&
      ['resolved', 'closed'].includes(dto.status) &&
      !query.resolved_at
    ) {
      patch.resolved_at = new Date();
    }
    if (dto.status && !['resolved', 'closed'].includes(dto.status)) {
      patch.resolved_at = null;
    }

    await query.update(patch);
    return this.findOne(id);
  }

  async assign(id: string, dto: AssignQueryDto): Promise<SupportQuery> {
    const query = await this.findOne(id);
    await query.update({
      assigned_to: dto.staff_id,
      status: query.status === 'open' ? 'in-progress' : query.status,
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const query = await this.findOne(id);
    await query.destroy();
  }

  /** Average response-time (created -> resolved) in hours, for admin KPIs. */
  async averageResponseTimeHours(): Promise<number | null> {
    const resolved = await this.queryModel.findAll({
      where: { resolved_at: { [Op.ne]: null } },
      attributes: ['created_at', 'resolved_at'],
    });
    if (!resolved.length) return null;

    const totalHours = resolved.reduce((sum, q) => {
      const diffMs =
        new Date(q.resolved_at as Date).getTime() -
        new Date(q.created_at).getTime();
      return sum + diffMs / (1000 * 60 * 60);
    }, 0);

    return Math.round((totalHours / resolved.length) * 10) / 10;
  }
}
