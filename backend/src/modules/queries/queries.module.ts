import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueriesController } from './queries.controller';
import { QueriesService } from './queries.service';
import { SupportQuery } from './models/query.model';

@Module({
  imports: [SequelizeModule.forFeature([SupportQuery])],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
