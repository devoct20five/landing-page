import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Candidate } from './models/candidate.model';
import { CandidateNote } from './models/candidate-note.model';
import { JobPosting } from './models/job-posting.model';

@Module({
  imports: [SequelizeModule.forFeature([JobPosting, Candidate, CandidateNote])],
  controllers: [JobsController, CandidatesController],
  providers: [JobsService, CandidatesService],
  exports: [JobsService, CandidatesService],
})
export class CareersModule {}
