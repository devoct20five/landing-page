import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { QueryApprovalDto } from './dto/query-approval.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  @RequirePermissions('approvals.view')
  findAll(@Query() query: QueryApprovalDto, @CurrentUser() user: RequestUser) {
    return this.approvalsService.findAll(query, user);
  }

  @Get(':id')
  @RequirePermissions('approvals.view')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approvalsService.findOne(id, user);
  }

  @Get('deliverables/:deliverableId/history')
  @RequirePermissions('approvals.view')
  versionHistory(
    @Param('deliverableId', ParseUUIDPipe) deliverableId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approvalsService.versionHistory(deliverableId, user);
  }

  @Post()
  @RequirePermissions('approvals.create')
  create(@Body() dto: CreateApprovalDto, @CurrentUser() user: RequestUser) {
    return this.approvalsService.create(dto, user);
  }

  @Patch(':id/review')
  @RequirePermissions('approvals.review')
  review(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReviewApprovalDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approvalsService.review(id, dto, user);
  }
}
