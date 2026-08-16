import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { User } from '@/modules/users/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Notification, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  // Exported so other modules (tasks, approvals, payments, queries, ...)
  // can inject NotificationsService and call notify()/notifyMany().
  exports: [NotificationsService],
})
export class NotificationsModule {}
