import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './models/project.model';
import { ProjectService as ProjectServiceLink } from './models/project-service.model';
import { ProjectTeamMember } from './models/project-team-member.model';
import { Deliverable } from './models/deliverable.model';
import { Client } from '../clients/models/client.model';
import { Service } from '../services/models/service.model';
import { User } from '../users/models/user.model';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Project,
      ProjectServiceLink,
      ProjectTeamMember,
      Deliverable,
      Client,
      Service,
      User,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, SequelizeModule],
})
export class ProjectsModule {}
