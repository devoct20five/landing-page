import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { ActivityLog } from './models/activity-log.model';
import { User } from '../users/models/user.model';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
import { paginate, Paginated } from '@/common/dto/pagination-query.dto';
import { AccessControlService } from '@/common/access-control/access-control.service';
import { UserType } from '@/common/enums/user-type.enum';
import type { RequestUser } from '../auth/types/authenticated-user.type';

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
    private readonly accessControl: AccessControlService,
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

  async findAll(
    query: QueryActivityLogDto,
    requester: RequestUser,
  ): Promise<Paginated<ActivityLog>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = await this.buildWhere(query, requester);

    const { rows, count } = await this.activityModel.findAndCountAll({
      where,
      include: INCLUDE,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return paginate(rows, count, page, limit);
  }

  /** Dashboard feeds ("recent activity ... grouped by day") for client/staff/admin portals. */
  async findGroupedByDay(
    query: QueryActivityLogDto,
    requester: RequestUser,
  ): Promise<ActivityDayGroup[]> {
    const where = await this.buildWhere(query, requester);
    const limit = query.limit ?? 50;

    const rows = await this.activityModel.findAll({
      where,
      include: INCLUDE,
      order: [['created_at', 'DESC']],
      limit,
    });

    const groups = new Map<string, ActivityLog[]>();
    for (const row of rows) {
      // Despite the model's `createdAt: 'created_at'` @Table option
      // (which does correctly generate the column in queries), the
      // instance/serialized property this model actually exposes is the
      // raw `created_at` name, not a camelCased `createdAt` getter —
      // confirmed by the JSON this API actually returns. `row.createdAt`
      // was silently `undefined` here, throwing on `.toISOString()`.
      const date = ((row as any).created_at as Date).toISOString().slice(0, 10);
      if (!groups.has(date)) groups.set(date, []);
      groups.get(date)!.push(row);
    }

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      items,
    }));
  }

  /**
   * docs/00_CURRENT_STATE_AUDIT.md §3/§46: query.clientId was previously
   * trusted outright — a client could read another client's activity
   * feed just by passing a different clientId. Now forced from the JWT
   * for client requesters; staff without agency-wide access are
   * restricted to their assigned projects' activity.
   */
  private async buildWhere(
    query: QueryActivityLogDto,
    requester: RequestUser,
  ): Promise<WhereOptions> {
    const where: WhereOptions = {};
    if (query.projectId) where['projectId'] = query.projectId;
    if (query.actorId) where['actorId'] = query.actorId;
    if (query.activityType) where['activityType'] = query.activityType;
    if (query.from || query.to) {
      where['created_at'] = {
        ...(query.from ? { [Op.gte]: new Date(query.from) } : {}),
        ...(query.to ? { [Op.lte]: new Date(query.to) } : {}),
      };
    }

    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (requester.roleSlug === 'staff') {
      const scope = await this.accessControl.scopeProjectIdWhereForStaff(requester);
      Object.assign(where, scope);
    } else if (query.clientId) {
      where['clientId'] = query.clientId;
    }

    return where;
  }
}
