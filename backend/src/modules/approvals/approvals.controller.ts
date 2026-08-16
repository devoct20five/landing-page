import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { QueryApprovalDto } from './dto/query-approval.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  findAll(@Query() query: QueryApprovalDto, @CurrentUser() user: RequestUser) {
    return this.approvalsService.findAll(query, user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approvalsService.findOne(id, user);
  }

  @Get('deliverables/:deliverableId/history')
  versionHistory(
    @Param('deliverableId', ParseIntPipe) deliverableId: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approvalsService.versionHistory(deliverableId, user);
  }

  @Post()
  create(@Body() dto: CreateApprovalDto, @CurrentUser() user: RequestUser) {
    return this.approvalsService.create(dto, user);
  }

  @Patch(':id/review')
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewApprovalDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approvalsService.review(id, dto, user);
  }
}
