import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';

import { Approval } from './models/approval.model';
import { User } from '../users/models/user.model';
import { File } from '../files/models/file.model';

import { CreateApprovalDto } from './dto/create-approval.dto';
import { ReviewApprovalDto } from './dto/review-approval.dto';
import { QueryApprovalDto } from './dto/query-approval.dto';

import { paginate, Paginated } from '@/common/dto/pagination-query.dto';

import { RequestUser } from '../auth/types/authenticated-user.type';
import { ApprovalStatus, UserType } from '@/common/enums/index.enum';

const INCLUDE = [
  {
    model: User,
    as: 'requester',
    attributes: ['id', 'firstName', 'lastName'],
  },
  {
    model: User,
    as: 'reviewer',
    attributes: ['id', 'firstName', 'lastName'],
  },
  {
    model: File,
    attributes: ['id', 'name', 'fileType', 'storageUrl', 'version'],
  },
];

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectModel(Approval)
    private readonly approvalModel: typeof Approval,
  ) {}

  async findAll(
    query: QueryApprovalDto,
    requester: RequestUser,
  ): Promise<Paginated<Approval>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: WhereOptions = {};

    if (query.projectId) {
      where['projectId'] = query.projectId;
    }

    if (query.clientId) {
      where['clientId'] = query.clientId;
    }

    if (query.deliverableId) {
      where['deliverableId'] = query.deliverableId;
    }

    if (query.status) {
      where['status'] = query.status;
    }

    // Clients can only see their own approvals.
    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId;
    }

    const { rows, count } = await this.approvalModel.findAndCountAll({
      where,
      include: INCLUDE,
      order: [['requestedAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return paginate(this.withWaitingTime(rows), count, page, limit);
  }

  async findOne(id: string, requester: RequestUser): Promise<Approval> {
    const approval = await this.approvalModel.findByPk(id, {
      include: INCLUDE,
    });

    if (!approval) {
      throw new NotFoundException(`Approval ${id} not found`);
    }

    this.assertClientCanAccess(approval, requester);

    return approval;
  }

  /**
   * Full version history for a deliverable.
   * Every approval round, oldest first.
   */
  async versionHistory(
    deliverableId: string,
    requester: RequestUser,
  ): Promise<Approval[]> {
    const where: WhereOptions = {
      deliverableId,
    };

    // Clients can only see approval history
    // belonging to their own client account.
    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId;
    }

    const rows = await this.approvalModel.findAll({
      where,
      include: INCLUDE,
      order: [['requestedAt', 'ASC']],
    });

    return this.withWaitingTime(rows);
  }

  /**
   * Staff/admin sends a deliverable version
   * to the client for sign-off.
   */
  async create(
    dto: CreateApprovalDto,
    requester: RequestUser,
  ): Promise<Approval> {
    if (requester.userType === UserType.CLIENT) {
      throw new ForbiddenException('Clients cannot create approval requests');
    }

    const approval = await this.approvalModel.create({
      ...dto,
      status: ApprovalStatus.PENDING,
      requestedBy: requester.id,
      requestedAt: new Date(),
    });

    return this.findOne(approval.id, requester);
  }

  /**
   * Client reviews a pending approval.
   *
   * Possible actions:
   * - APPROVED
   * - CHANGES_REQUESTED
   * - REJECTED
   */
  async review(
    id: string,
    dto: ReviewApprovalDto,
    requester: RequestUser,
  ): Promise<Approval> {
    const approval = await this.findOne(id, requester);

    if (requester.userType !== UserType.CLIENT) {
      throw new ForbiddenException('Only the client can review an approval');
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('This approval has already been reviewed');
    }

    if (dto.status !== ApprovalStatus.APPROVED && !dto.feedback) {
      throw new BadRequestException(
        'Feedback is required when requesting changes or rejecting',
      );
    }

    await approval.update({
      status: dto.status,
      feedback: dto.feedback ?? null,
      reviewedBy: requester.id,
      reviewedAt: new Date(),
    });

    return this.findOne(id, requester);
  }

  /**
   * Adds the amount of time a pending approval
   * has been waiting for client review.
   */
  private withWaitingTime(approvals: Approval[]): Approval[] {
    return approvals.map((approval) => {
      const plain = approval.get({
        plain: true,
      }) as Approval & {
        waitingHours?: number;
      };

      if (plain.status === ApprovalStatus.PENDING) {
        plain.waitingHours = Math.round(
          (Date.now() - new Date(plain.requestedAt).getTime()) /
            (1000 * 60 * 60),
        );
      }

      return plain;
    });
  }

  /**
   * Ensures a client can only access
   * approvals belonging to their client account.
   */
  private assertClientCanAccess(
    approval: Approval,
    requester: RequestUser,
  ): void {
    if (
      requester.userType === UserType.CLIENT &&
      approval.clientId !== requester.clientId
    ) {
      throw new ForbiddenException('You do not have access to this approval');
    }
  }
}
