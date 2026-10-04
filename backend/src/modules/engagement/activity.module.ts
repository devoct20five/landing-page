import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityLog } from './models/activity-log.model';
import { AccessControlModule } from '@/common/access-control/access-control.module';

@Module({
  imports: [SequelizeModule.forFeature([ActivityLog]), AccessControlModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService], // other modules inject this to write audit entries
})
export class ActivityModule {}
