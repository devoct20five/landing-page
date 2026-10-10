import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from '../services/models/service.model';
import { ServicePlan } from '../services/models/service-plan.model';
import { ServicePlanPackage } from '../services/models/service-plan-package.model';
import { ServicePlanFeature } from '../services/models/service-plan-feature.model';
import { ServiceAddon } from '../services/models/service-addon.model';
import { computeQuote } from './pricing';

/** Public, read-only, sales-facing view of the catalogue. */
@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Service) private readonly serviceModel: typeof Service,
    @InjectModel(ServicePlan) private readonly planModel: typeof ServicePlan,
    @InjectModel(ServiceAddon) private readonly addonModel: typeof ServiceAddon,
  ) {}

  async list() {
    const services = await this.serviceModel.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC']],
    });
    const out: any[] = [];
    for (const s of services) {
      const v = await this.present(s);
      if (v.plans.length > 0) out.push(v); // services with no sellable plan are not shown
    }
    return out;
  }

  async bySlug(slug: string) {
    const s = await this.serviceModel.findOne({
      where: { slug, isActive: true },
    });
    if (!s) throw new NotFoundException('Service not found');
    const v = await this.present(s);
    if (v.plans.length === 0) throw new NotFoundException('Service not found');
    return v;
  }

  /** One purchasable package. Checkout resolves against this: DB only, never client data. */
  async resolvePlan(serviceSlug: string, planSlug: string) {
    const service = await this.serviceModel.findOne({
      where: { slug: serviceSlug, isActive: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    const plan = await this.planModel.findOne({
      where: { serviceId: service.id, slug: planSlug, isActive: true },
      include: [
        {
          model: ServicePlanPackage,
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
        {
          model: ServicePlanFeature,
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
      ],
    });
    if (!plan || plan.price == null)
      throw new NotFoundException('Package not found');
    return { service, plan };
  }

  private async present(s: Service) {
    const plans = await this.planModel.findAll({
      where: { serviceId: s.id, isActive: true },
      order: [['sortOrder', 'ASC']],
      include: [
        {
          model: ServicePlanPackage,
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
        {
          model: ServicePlanFeature,
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
      ],
    });
    const addons = await this.addonModel.findAll({
      where: { serviceId: s.id, isActive: true },
      order: [['sortOrder', 'ASC']],
    });
    const isProject = s.pricingMode === 'project';

    return {
      slug: s.slug,
      name: s.name,
      pricingMode: s.pricingMode,
      unit: { singular: s.unitSingular, plural: s.unitPlural },
      hero: {
        headline: s.heroHeadline,
        tag: s.heroTag,
        imageUrl: s.heroImageUrl,
      },
      custom: s.customTitle
        ? {
            title: s.customTitle,
            body: s.customBody,
            fromPrice:
              s.customFromPrice == null ? null : Number(s.customFromPrice),
          }
        : null,
      addons: addons.map((a) => ({
        code: a.code,
        label: a.label,
        price: Number(a.price),
      })),
      plans: plans
        .filter((p) => p.slug && p.price != null && Number(p.price) > 0)
        .map((p) => ({
          slug: p.slug as string,
          name: p.name,
          icon: p.icon,
          description: p.description,
          deliveryDays: p.deliveryDays,
          featured: p.isFeatured,
          unitPrice: Number(p.price),
          features: (p.features ?? []).map((f) => f.featureText),
          packs: isProject
            ? []
            : (p.packages ?? []).map((k) => {
                const q = computeQuote({
                  unitPrice: p.price as number,
                  quantity: k.quantity,
                  packDiscountPercent: k.discountPercent,
                  addonPrices: [],
                  promoPercent: 0,
                  taxRate: 0,
                });
                return {
                  id: k.id,
                  label: k.label,
                  quantity: k.quantity,
                  discountPercent: Number(k.discountPercent),
                  listPrice: q.listPrice,
                  total: q.packTotal,
                  unitPrice: q.packTotal / q.quantity,
                  savings: q.packDiscount,
                };
              }),
          projectTypes: isProject ? (p.packages ?? []).map((k) => k.label) : [],
        })),
    };
  }
}
