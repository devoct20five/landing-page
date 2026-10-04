import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { BehindTheWorkService } from './behind-the-work.service';
import { CreateBehindTheWorkDto } from './dto/create-behind-the-work.dto';
import { UpdateBehindTheWorkDto } from './dto/update-behind-the-work.dto';
import { QueryBehindTheWorkDto } from './dto/query-behind-the-work.dto';
import { BtwStatus } from './models/behind-the-work.model';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import { Public } from '@/common/decorators/public.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

// Public showcase feed — no auth, published items only.
// Kept separate so it can be mounted without JwtAuthGuard.
//
// NOTE: this comment ("no auth") previously wasn't actually true — the
// global JwtAuthGuard (registered via APP_GUARD in app.module.ts) applies
// to every controller by default, and nothing here was marked @Public().
// This "public" feed has been requiring a valid JWT the whole time,
// contradicting its own stated intent. @Public() is what actually opts a
// route out of the global guard; being a separate controller class does
// nothing on its own.
@Public()
@Controller('behind-the-work/public')
export class BehindTheWorkPublicController {
  constructor(private readonly service: BehindTheWorkService) {}

  @Get()
  findPublished(@Query() query: QueryBehindTheWorkDto) {
    return this.service.findPublished(query);
  }
}

// Admin-managed CRUD (see feature-list 3.12: Behind the Work)
@UseGuards(JwtAuthGuard)
@Controller('behind-the-work')
export class BehindTheWorkController {
  constructor(private readonly service: BehindTheWorkService) {}

  @Post()
  @RequirePermissions('behind_the_work.create')
  create(@Body() dto: CreateBehindTheWorkDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('behind_the_work.view')
  findAll(@Query() query: QueryBehindTheWorkDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('behind_the_work.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('behind_the_work.edit')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBehindTheWorkDto,
  ) {
    return this.service.update(id, dto);
  }

  // Toggle publish / unpublish
  @Patch(':id/publish')
  @RequirePermissions('behind_the_work.publish')
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.setStatus(id, BtwStatus.PUBLISHED);
  }

  @Patch(':id/unpublish')
  @RequirePermissions('behind_the_work.publish')
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.setStatus(id, BtwStatus.DRAFT);
  }

  // No behind_the_work.delete permission exists in the catalog (Phase 1
  // gap vs spec §27, which does list "delete") — reusing .edit rather
  // than inventing an unseeded permission slug. Worth adding a dedicated
  // permission later if delete ever needs a narrower grant than edit.
  @Delete(':id')
  @RequirePermissions('behind_the_work.edit')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
