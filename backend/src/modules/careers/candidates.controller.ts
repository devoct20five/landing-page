import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CreateCandidateNoteDto } from './dto/create-candidate-note.dto';
import { UpdateCandidateStageDto } from './dto/update-candidate-stage.dto';
import { CandidatesService } from './candidates.service';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';

// NOTE: `create` is gated as an internal careers.create action (staff/
// admin manually adding a candidate record) rather than left open as a
// public job-application intake — nothing in this codebase implements an
// unauthenticated application form, so treating it as public would be
// guessing at an unbuilt feature, not fixing an existing one. If a public
// "apply for this job" flow is wanted, that's a deliberate product
// decision (likely a separate @Public() endpoint with its own rate
// limiting/spam controls) for a future phase, not something to assume here.
@Controller('careers/candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @RequirePermissions('careers.create')
  create(@Body() dto: CreateCandidateDto) {
    return this.candidatesService.create(dto);
  }

  @Get()
  @RequirePermissions('careers.view')
  findAll(@Query() filter: CandidateFilterDto) {
    return this.candidatesService.findAll(filter);
  }

  @Get('pipeline')
  @RequirePermissions('careers.view')
  pipeline(@Query('job_id') jobId?: string) {
    // job_id is a UUID string; Number(...) always produced NaN here.
    return this.candidatesService.pipeline(jobId);
  }

  @Get(':id')
  @RequirePermissions('careers.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id/stage')
  @RequirePermissions('careers.edit')
  updateStage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCandidateStageDto,
  ) {
    return this.candidatesService.updateStage(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermissions('careers.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.candidatesService.remove(id);
  }

  @Post(':id/notes')
  @RequirePermissions('careers.edit')
  addNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCandidateNoteDto,
  ) {
    return this.candidatesService.addNote(id, dto);
  }

  @Get(':id/notes')
  @RequirePermissions('careers.view')
  listNotes(@Param('id', ParseUUIDPipe) id: string) {
    return this.candidatesService.listNotes(id);
  }
}
