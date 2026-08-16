import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Service } from './models/service.model';
import { ServicePlan } from './models/service-plan.model';
import { ServicePlanPackage } from './models/service-plan-package.model';
import { ServicePlanFeature } from './models/service-plan-feature.model';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import {
  CreateServicePlanDto,
  PlanFeatureDto,
  PlanPackageDto,
} from './dto/create-service-plan.dto';
import { UpdateServicePlanDto } from './dto/update-service-plan.dto';

const PLAN_INCLUDE = [
  {
    model: ServicePlanPackage,
    separate: true,
    order: [['sortOrder', 'ASC']] as any,
  },
  {
    model: ServicePlanFeature,
    separate: true,
    order: [['sortOrder', 'ASC']] as any,
  },
];

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private readonly serviceModel: typeof Service,
    @InjectModel(ServicePlan)
    private readonly servicePlanModel: typeof ServicePlan,
    @InjectModel(ServicePlanPackage)
    private readonly packageModel: typeof ServicePlanPackage,
    @InjectModel(ServicePlanFeature)
    private readonly featureModel: typeof ServicePlanFeature,
  ) {}

  // ---------------------------------------------------------------------
  // Services (catalog categories — Editing, Design, 3D, Web Development)
  // ---------------------------------------------------------------------

  async create(dto: CreateServiceDto): Promise<Service> {
    return this.serviceModel.create({ ...dto } as any);
  }

  /** Backs client 1.6 browse (activeOnly=true) and admin 3.14 management. */
  async findAll(query: QueryServiceDto) {
    const where: any = {};
    if (query.activeOnly) where.isActive = true;
    if (query.search) where.name = { [Op.like]: `%${query.search}%` };

    return this.serviceModel.findAll({
      where,
      include: [
        {
          model: ServicePlan,
          separate: true,
          where: query.activeOnly ? { isActive: true } : undefined,
          order: [['sortOrder', 'ASC']],
          include: PLAN_INCLUDE as any,
        },
      ],
      order: [['sortOrder', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceModel.findByPk(id, {
      include: [
        {
          model: ServicePlan,
          separate: true,
          order: [['sortOrder', 'ASC']],
          include: PLAN_INCLUDE as any,
        },
      ],
    });
    if (!service) throw new NotFoundException(`Service ${id} not found`);
    return service;
  }

  async update(id: number, dto: UpdateServiceDto): Promise<Service> {
    await this.findOne(id);
    await this.serviceModel.update(dto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.serviceModel.destroy({ where: { id } });
  }

  // ---------------------------------------------------------------------
  // Plans (Standard / Advance / Black) — with nested packages & features
  // ---------------------------------------------------------------------

  async addPlan(
    serviceId: number,
    dto: CreateServicePlanDto,
  ): Promise<ServicePlan> {
    await this.findOne(serviceId);
    const { packages, features, ...rest } = dto;

    const plan = await this.servicePlanModel.create({
      ...rest,
      serviceId,
    } as any);

    if (packages?.length) {
      await this.packageModel.bulkCreate(
        packages.map((p) => ({ ...p, planId: plan.id })) as any,
      );
    }
    if (features?.length) {
      await this.featureModel.bulkCreate(
        features.map((f) => ({ ...f, planId: plan.id })) as any,
      );
    }

    return this.findPlan(serviceId, plan.id);
  }

  async findPlan(serviceId: number, planId: number): Promise<ServicePlan> {
    const plan = await this.servicePlanModel.findOne({
      where: { id: planId, serviceId },
      include: PLAN_INCLUDE as any,
    });
    if (!plan) throw new NotFoundException('Service plan not found');
    return plan;
  }

  async updatePlan(
    serviceId: number,
    planId: number,
    dto: UpdateServicePlanDto,
  ): Promise<ServicePlan> {
    const plan = await this.findPlan(serviceId, planId);
    await plan.update(dto);
    return this.findPlan(serviceId, planId);
  }

  /** Active/Draft status toggle for a plan (3.14). */
  async togglePlanStatus(
    serviceId: number,
    planId: number,
  ): Promise<ServicePlan> {
    const plan = await this.findPlan(serviceId, planId);
    await plan.update({ isActive: !plan.isActive });
    return plan;
  }

  async removePlan(serviceId: number, planId: number): Promise<void> {
    const plan = await this.findPlan(serviceId, planId);
    await plan.destroy();
  }

  /** Duplicate a plan (and its packages/features) — admin 3.14 action. */
  async duplicatePlan(serviceId: number, planId: number): Promise<ServicePlan> {
    const source = await this.findPlan(serviceId, planId);

    const copy = await this.servicePlanModel.create({
      serviceId,
      name: `${source.name} (Copy)`,
      icon: source.icon,
      price: source.price,
      totalPrice: source.totalPrice,
      discountPercent: source.discountPercent,
      isFeatured: false,
      isActive: false, // duplicated plans start as Draft
      sortOrder: source.sortOrder,
    } as any);

    if (source.packages?.length) {
      await this.packageModel.bulkCreate(
        source.packages.map((p) => ({
          label: p.label,
          sortOrder: p.sortOrder,
          planId: copy.id,
        })) as any,
      );
    }
    if (source.features?.length) {
      await this.featureModel.bulkCreate(
        source.features.map((f) => ({
          featureText: f.featureText,
          sortOrder: f.sortOrder,
          planId: copy.id,
        })) as any,
      );
    }

    return this.findPlan(serviceId, copy.id);
  }

  // -- packages / features on an existing plan ----------------------------

  async addPackage(
    planId: number,
    dto: PlanPackageDto,
  ): Promise<ServicePlanPackage> {
    return this.packageModel.create({ ...dto, planId } as any);
  }

  async removePackage(planId: number, packageId: number): Promise<void> {
    const pkg = await this.packageModel.findOne({
      where: { id: packageId, planId },
    });
    if (!pkg) throw new NotFoundException('Package not found');
    await pkg.destroy();
  }

  async addFeature(
    planId: number,
    dto: PlanFeatureDto,
  ): Promise<ServicePlanFeature> {
    return this.featureModel.create({ ...dto, planId } as any);
  }

  async removeFeature(planId: number, featureId: number): Promise<void> {
    const feature = await this.featureModel.findOne({
      where: { id: featureId, planId },
    });
    if (!feature) throw new NotFoundException('Feature not found');
    await feature.destroy();
  }
}
