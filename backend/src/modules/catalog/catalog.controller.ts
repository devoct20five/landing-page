import { Controller, Get, Header, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '@/common/decorators/public.decorator';
import { CatalogService } from './catalog.service';

/** Public storefront catalogue. Read-only, unauthenticated; admin management stays on /services. */
@Public()
@Controller('public/catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('services')
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120')
  list() {
    return this.catalog.list();
  }

  @Get('services/:slug')
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120')
  one(@Param('slug') slug: string) {
    return this.catalog.bySlug(slug);
  }
}
