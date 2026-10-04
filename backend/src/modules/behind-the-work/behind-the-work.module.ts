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
  // Order matters: BehindTheWorkController declares `GET /:id`, which
  // would otherwise shadow `GET /public` (Nest/Express match routes in
  // registration order, and `/public` matches the `:id` wildcard first if
  // that controller is registered first — exactly what was happening
  // here). BehindTheWorkPublicController must come first so its static
  // `/public` path is matched before the wildcard gets a chance to.
  controllers: [BehindTheWorkPublicController, BehindTheWorkController],
  providers: [BehindTheWorkService],
  exports: [BehindTheWorkService],
})
export class BehindTheWorkModule {}
