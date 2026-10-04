import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { Approval } from './models/approval.model';
import { AccessControlModule } from '@/common/access-control/access-control.module';

@Module({
  imports: [SequelizeModule.forFeature([Approval]), AccessControlModule],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
