import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CreateCandidateNoteDto } from './dto/create-candidate-note.dto';
import { UpdateCandidateStageDto } from './dto/update-candidate-stage.dto';
import { CandidatesService } from './candidates.service';

@Controller('careers/candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  create(@Body() dto: CreateCandidateDto) {
    return this.candidatesService.create(dto);
  }

  @Get()
  findAll(@Query() filter: CandidateFilterDto) {
    return this.candidatesService.findAll(filter);
  }

  @Get('pipeline')
  pipeline(@Query('job_id') jobId?: string) {
    return this.candidatesService.pipeline(jobId ? Number(jobId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCandidateStageDto,
  ) {
    return this.candidatesService.updateStage(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.remove(id);
  }

  @Post(':id/notes')
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCandidateNoteDto,
  ) {
    return this.candidatesService.addNote(id, dto);
  }

  @Get(':id/notes')
  listNotes(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.listNotes(id);
  }
}
