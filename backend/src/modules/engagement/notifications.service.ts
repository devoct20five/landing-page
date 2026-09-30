import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  /**
   * Programmatic helper for other modules to call directly, e.g.:
   *   this.notificationsService.notify({
   *     user_id: assignee.id,
   *     title: 'New task assigned',
   *     message: `You were assigned "${task.title}"`,
   *     link_url: `/staff/tasks/${task.id}`,
   *   });
   * Not exposed over HTTP by default — wire the controller's POST route
   * behind an admin/system guard if you need it externally.
   */
  async notify(dto: {
    user_id: string;
    title: string;
    message?: string;
    link_url?: string;
  }) {
    return this.notificationModel.create({ ...dto, is_read: false } as any);
  }

  async notifyMany(
    userIds: string[],
    payload: { title: string; message?: string; link_url?: string },
  ) {
    const rows = userIds.map((user_id) => ({
      ...payload,
      user_id,
      is_read: false,
    }));
    return this.notificationModel.bulkCreate(rows as any[]);
  }

  async create(dto: CreateNotificationDto) {
    if (dto.user_ids?.length) {
      return this.notifyMany(dto.user_ids, {
        title: dto.title,
        message: dto.message,
        link_url: dto.link_url,
      });
    }
    if (!dto.user_id) {
      throw new ForbiddenException('Provide either user_id or user_ids');
    }
    return this.notify({
      user_id: dto.user_id,
      title: dto.title,
      message: dto.message,
      link_url: dto.link_url,
    });
  }

  async findForUser(userId: string, query: QueryNotificationDto) {
    const where: Record<string, any> = { user_id: userId };
    if (query.unread) where.is_read = false;

    const { rows, count } = await this.notificationModel.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: query.limit,
      offset: query.offset,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        totalPages: Math.ceil(count / (query.limit ?? 20)),
      },
    };
  }

  async unreadCount(userId: string) {
    const count = await this.notificationModel.count({
      where: { user_id: userId, is_read: false },
    });
    return { unread: count };
  }

  async markAsRead(id: string, userId: string) {
    const item = await this.notificationModel.findByPk(id);
    if (!item) throw new NotFoundException(`Notification #${id} not found`);
    if (item.user_id !== userId) {
      throw new ForbiddenException('This notification does not belong to you');
    }
    await item.update({ is_read: true });
    return item;
  }

  async markAllAsRead(userId: string) {
    const [affected] = await this.notificationModel.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } },
    );
    return { updated: affected };
  }

  async remove(id: string, userId: string) {
    const item = await this.notificationModel.findByPk(id);
    if (!item) throw new NotFoundException(`Notification #${id} not found`);
    if (item.user_id !== userId) {
      throw new ForbiddenException('This notification does not belong to you');
    }
    await item.destroy();
    return { id, deleted: true };
  }
}
