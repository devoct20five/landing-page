import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions, literal } from 'sequelize';
import { Task } from './models/task.model';
import { TaskComment } from './models/task-comment.model';
import { User } from '../users/models/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { paginate, Paginated } from '@/common/dto/pagination-query.dto';

import { RequestUser } from '../auth/types/authenticated-user.type';
import { UserType } from '@/common/enums/index.enum';

const COMMENT_COUNT_LITERAL = literal(
  '(SELECT COUNT(*) FROM task_comments WHERE task_comments.task_id = Task.id)',
);

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(TaskComment) private readonly commentModel: typeof TaskComment,
  ) {}

  async findAll(
    query: QueryTaskDto,
    requester: RequestUser,
  ): Promise<Paginated<Task>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: WhereOptions = {};

    if (query.projectId) where['projectId'] = query.projectId;
    if (query.clientId) where['clientId'] = query.clientId;
    if (query.assigneeId) where['assigneeId'] = query.assigneeId;
    if (query.status) where['status'] = query.status;
    if (query.priority) where['priority'] = query.priority;
    if (query.search) where['title'] = { [Op.like]: `%${query.search}%` };

    // A staff member scoped view: "my tasks" unless they explicitly query someone else's
    // (that's enforced by a Guard/RBAC layer in the auth module; the service just narrows
    // the client's own visibility so a client can never list another client's tasks).
    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId;
    }

    if (query.dueLabel === 'due-today') {
      where['dueDate'] = literal('due_date = CURDATE()');
    } else if (query.dueLabel === 'overdue') {
      where['dueDate'] = {
        [Op.lt]: literal('CURDATE()'),
      };
      where['status'] = { [Op.notIn]: ['completed', 'cancelled'] };
    }

    const { rows, count } = await this.taskModel.findAndCountAll({
      where,
      attributes: {
        include: [[COMMENT_COUNT_LITERAL, 'commentCount']],
      },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
      ],
      order: [
        ['dueDate', 'ASC'],
        ['id', 'DESC'],
      ],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return paginate(rows, count, page, limit);
  }

  async findOne(id: string, requester: RequestUser): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      attributes: { include: [[COMMENT_COUNT_LITERAL, 'commentCount']] },
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    this.assertClientCanAccess(task, requester);
    return task;
  }

  async create(dto: CreateTaskDto, requester: RequestUser): Promise<Task> {
    const task = await this.taskModel.create({
      ...dto,
      createdBy: requester.id,
    } as any);
    return this.findOne(task.id, requester);
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    requester: RequestUser,
  ): Promise<Task> {
    const task = await this.findOne(id, requester);
    await task.update(dto);
    return this.findOne(id, requester);
  }

  async updateStatus(
    id: string,
    status: string,
    requester: RequestUser,
  ): Promise<Task> {
    const task = await this.findOne(id, requester);
    await task.update({ status } as any);
    return this.findOne(id, requester);
  }

  async remove(id: string, requester: RequestUser): Promise<void> {
    const task = await this.findOne(id, requester);
    await task.destroy();
  }

  async listComments(
    taskId: string,
    requester: RequestUser,
  ): Promise<TaskComment[]> {
    await this.findOne(taskId, requester); // 404s + access check
    return this.commentModel.findAll({
      where: { taskId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  async addComment(
    taskId: string,
    dto: CreateTaskCommentDto,
    requester: RequestUser,
  ): Promise<TaskComment> {
    await this.findOne(taskId, requester);
    const comment = await this.commentModel.create({
      taskId,
      userId: requester.id,
      comment: dto.comment,
    } as any);
    const withUser = await this.commentModel.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
      ],
    });
    return withUser ?? comment;
  }

  private assertClientCanAccess(task: Task, requester: RequestUser): void {
    if (
      requester.userType === UserType.CLIENT &&
      task.clientId !== requester.clientId
    ) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}
