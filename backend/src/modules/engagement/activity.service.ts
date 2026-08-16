import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { ActivityLog } from './models/activity-log.model';
import { User } from '../users/models/user.model';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
import { paginate, Paginated } from '@/common/dto/pagination-query.dto';

export interface ActivityDayGroup {
  date: string; // YYYY-MM-DD
  items: ActivityLog[];
}

const INCLUDE = [
  { model: User, attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
];

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(ActivityLog)
    private readonly activityModel: typeof ActivityLog,
  ) {}

  /**
   * Reusable writer other modules should inject and call, e.g.:
   *   this.activityService.log({ actorId, projectId, clientId,
   *     activityType: ActivityType.TASK, description: '...' })
   * Fire-and-forget by design — a failed audit write should never fail the primary action.
   */
  async log(dto: CreateActivityLogDto): Promise<ActivityLog> {
    return this.activityModel.create({
      actorId: dto.actorId ?? null,
      projectId: dto.projectId ?? null,
      clientId: dto.clientId ?? null,
      activityType: dto.activityType,
      description: dto.description,
      metadataJson: dto.metadata ?? null,
    } as any);
  }

  async findAll(query: QueryActivityLogDto): Promise<Paginated<ActivityLog>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = this.buildWhere(query);

    const { rows, count } = await this.activityModel.findAndCountAll({
      where,
      include: INCLUDE,
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return paginate(rows, count, page, limit);
  }

  /** Dashboard feeds ("recent activity ... grouped by day") for client/staff/admin portals. */
  async findGroupedByDay(
    query: QueryActivityLogDto,
  ): Promise<ActivityDayGroup[]> {
    const where = this.buildWhere(query);
    const limit = query.limit ?? 50;

    const rows = await this.activityModel.findAll({
      where,
      include: INCLUDE,
      order: [['createdAt', 'DESC']],
      limit,
    });

    const groups = new Map<string, ActivityLog[]>();
    for (const row of rows) {
      const date = (row.createdAt as unknown as Date)
        .toISOString()
        .slice(0, 10);
      if (!groups.has(date)) groups.set(date, []);
      groups.get(date)!.push(row);
    }

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      items,
    }));
  }

  private buildWhere(query: QueryActivityLogDto): WhereOptions {
    const where: WhereOptions = {};
    if (query.projectId) where['projectId'] = query.projectId;
    if (query.clientId) where['clientId'] = query.clientId;
    if (query.actorId) where['actorId'] = query.actorId;
    if (query.activityType) where['activityType'] = query.activityType;
    if (query.from || query.to) {
      where['createdAt'] = {
        ...(query.from ? { [Op.gte]: new Date(query.from) } : {}),
        ...(query.to ? { [Op.lte]: new Date(query.to) } : {}),
      };
    }
    return where;
  }
}
