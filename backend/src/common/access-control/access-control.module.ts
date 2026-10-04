import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectTeamMember } from '@/modules/projects/models/project-team-member.model';
import { Project } from '@/modules/projects/models/project.model';
import { Folder } from '@/modules/files/models/folder.model';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [SequelizeModule.forFeature([ProjectTeamMember, Project, Folder])],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
