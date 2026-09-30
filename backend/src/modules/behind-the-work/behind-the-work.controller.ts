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
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
// Public showcase feed — no auth, published items only.
// Kept separate so it can be mounted without JwtAuthGuard.
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
  create(
    @Body() dto: CreateBehindTheWorkDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.create(dto, user.id);
  }

  @Get()
  findAll(@Query() query: QueryBehindTheWorkDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBehindTheWorkDto,
  ) {
    return this.service.update(id, dto);
  }

  // Toggle publish / unpublish
  @Patch(':id/publish')
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.setStatus(id, BtwStatus.PUBLISHED);
  }

  @Patch(':id/unpublish')
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.setStatus(id, BtwStatus.DRAFT);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
