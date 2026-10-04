import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

const SERVICES = [
  { slug: 'brand-identity', name: 'Brand Identity', heroTag: 'Branding', sortOrder: 1 },
  { slug: 'social-media', name: 'Social Media Management', heroTag: 'Marketing', sortOrder: 2 },
  { slug: 'video-production', name: 'Video Production', heroTag: 'Content', sortOrder: 3 },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const existing = (await queryInterface.sequelize.query('SELECT slug FROM services', {
      type: 'SELECT',
    })) as Array<{ slug: string }>;
    const existingSlugs = new Set(existing.map((s) => s.slug));

    const rows = SERVICES.filter((s) => !existingSlugs.has(s.slug)).map((s) => ({
      id: randomUUID(),
      slug: s.slug,
      name: s.name,
      hero_headline: null,
      hero_tag: s.heroTag,
      hero_image_url: null,
      is_active: true,
      sort_order: s.sortOrder,
      created_at: new Date(),
    }));

    if (rows.length > 0) {
      await queryInterface.bulkInsert('services', rows);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('services', { slug: SERVICES.map((s) => s.slug) });
  },
};
