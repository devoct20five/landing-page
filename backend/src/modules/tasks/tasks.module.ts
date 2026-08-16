import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { TaskComment } from './models/task-comment.model';

@Module({
  imports: [SequelizeModule.forFeature([Task, TaskComment])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
