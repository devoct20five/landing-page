import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

// Permission-gated per database/helpers/permission-catalog.ts. Resource
// scoping (client tenancy, staff project assignment) happens inside
// TasksService via AccessControlService — a permission only says someone
// can view/edit *some* task, not *which* ones.
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @RequirePermissions('tasks.view')
  findAll(@Query() query: QueryTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.findAll(query, user);
  }

  @Get(':id')
  @RequirePermissions('tasks.view')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.findOne(id, user);
  }

  @Post()
  @RequirePermissions('tasks.create')
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.create(dto, user);
  }

  @Patch(':id')
  @RequirePermissions('tasks.edit')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  @Patch(':id/status')
  @RequirePermissions('tasks.edit')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.updateStatus(id, dto.status, user);
  }

  @Delete(':id')
  @RequirePermissions('tasks.delete')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.remove(id, user);
  }

  @Get(':id/comments')
  @RequirePermissions('tasks.view')
  listComments(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.listComments(id, user);
  }

  @Post(':id/comments')
  @RequirePermissions('tasks.edit')
  addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateTaskCommentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.addComment(id, dto, user);
  }
}
