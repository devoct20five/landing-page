import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Extends the EXISTING catalogue (services -> service_plans -> packages /
// features) so the public website can sell from it. No parallel catalogue.
//
// Vocabulary: the website says "package" for what the backend calls a
// ServicePlan (Standard / Advance / Black). A ServicePlanPackage row is a
// purchasable size of that plan ("3 Pack", "7 Pack"), so it gets a
// quantity + volume discount here. The server derives every price from
// these columns; the frontend never sends or computes a price.
module.exports = {
  up: async (qi: QueryInterface) => {
    await qi.addColumn('services', 'pricing_mode', {
      type: DataTypes.ENUM('packs', 'project'),
      allowNull: false,
      defaultValue: 'packs',
    });
    await qi.addColumn('services', 'unit_singular', { type: DataTypes.STRING(30), allowNull: true });
    await qi.addColumn('services', 'unit_plural', { type: DataTypes.STRING(30), allowNull: true });
    await qi.addColumn('services', 'custom_title', { type: DataTypes.STRING(150), allowNull: true });
    await qi.addColumn('services', 'custom_body', { type: DataTypes.STRING(500), allowNull: true });
    await qi.addColumn('services', 'custom_from_price', { type: DataTypes.DECIMAL(12, 2), allowNull: true });

    await qi.addColumn('service_plans', 'slug', { type: DataTypes.STRING(60), allowNull: true });
    await qi.addColumn('service_plans', 'description', { type: DataTypes.STRING(500), allowNull: true });
    await qi.addColumn('service_plans', 'delivery_days', { type: DataTypes.SMALLINT.UNSIGNED, allowNull: true });
    await qi.addIndex('service_plans', ['service_id', 'slug'], {
      unique: true,
      name: 'service_plans_service_id_slug_unique',
    });

    await qi.addColumn('service_plan_packages', 'quantity', {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    });
    await qi.addColumn('service_plan_packages', 'discount_percent', {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    });

    await qi.createTable('service_addons', {
      id: uuidPk,
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'services', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      code: { type: DataTypes.STRING(40), allowNull: false },
      label: { type: DataTypes.STRING(150), allowNull: false },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      sort_order: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
    });
    await qi.addIndex('service_addons', ['service_id', 'code'], {
      unique: true,
      name: 'service_addons_service_id_code_unique',
    });

    await qi.createTable('promo_codes', {
      id: uuidPk,
      code: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      percent_off: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      expires_at: { type: DataTypes.DATE, allowNull: true },
      max_redemptions: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      redemptions: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      ...timestamps(),
    });
  },

  down: async (qi: QueryInterface) => {
    await qi.dropTable('promo_codes');
    await qi.dropTable('service_addons');
    await qi.removeColumn('service_plan_packages', 'discount_percent');
    await qi.removeColumn('service_plan_packages', 'quantity');
    await qi.removeIndex('service_plans', 'service_plans_service_id_slug_unique');
    await qi.removeColumn('service_plans', 'delivery_days');
    await qi.removeColumn('service_plans', 'description');
    await qi.removeColumn('service_plans', 'slug');
    for (const c of ['custom_from_price', 'custom_body', 'custom_title', 'unit_plural', 'unit_singular', 'pricing_mode']) {
      await qi.removeColumn('services', c);
    }
  },
};
