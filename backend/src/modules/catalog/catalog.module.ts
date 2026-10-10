import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from '../services/models/service.model';
import { ServicePlan } from '../services/models/service-plan.model';
import { ServicePlanPackage } from '../services/models/service-plan-package.model';
import { ServicePlanFeature } from '../services/models/service-plan-feature.model';
import { ServiceAddon } from '../services/models/service-addon.model';
import { PromoCode } from '../services/models/promo-code.model';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Service,
      ServicePlan,
      ServicePlanPackage,
      ServicePlanFeature,
      ServiceAddon,
      PromoCode,
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService, SequelizeModule],
})
export class CatalogModule {}
