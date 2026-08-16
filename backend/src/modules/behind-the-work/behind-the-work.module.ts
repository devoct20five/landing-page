import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BehindTheWork } from './models/behind-the-work.model';
import { BehindTheWorkService } from './behind-the-work.service';
import {
  BehindTheWorkController,
  BehindTheWorkPublicController,
} from './behind-the-work.controller';
import { User } from '../users/models/user.model';
import { Project } from '../projects/models/project.model';
import { Client } from '../clients/models/client.model';

@Module({
  imports: [SequelizeModule.forFeature([BehindTheWork, User, Project, Client])],
  controllers: [BehindTheWorkController, BehindTheWorkPublicController],
  providers: [BehindTheWorkService],
  exports: [BehindTheWorkService],
})
export class BehindTheWorkModule {}
