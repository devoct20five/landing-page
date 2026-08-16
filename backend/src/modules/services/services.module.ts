import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { ServicePlan } from './models/service-plan.model';
import { ServicePlanPackage } from './models/service-plan-package.model';
import { ServicePlanFeature } from './models/service-plan-feature.model';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Service,
      ServicePlan,
      ServicePlanPackage,
      ServicePlanFeature,
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, SequelizeModule],
})
export class ServicesModule {}
