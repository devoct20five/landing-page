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
import { AccessControlService } from '@/common/access-control/access-control.service';

import type { RequestUser } from '../auth/types/authenticated-user.type';
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
    private readonly accessControl: AccessControlService,
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

    if (query.deliverableId) {
      where['deliverableId'] = query.deliverableId;
    }

    if (query.status) {
      where['status'] = query.status;
    }

    // docs/00_CURRENT_STATE_AUDIT.md §3: client scoping (forcing
    // requester.clientId, ignoring query.clientId) already existed here.
    // What was missing was the staff side — a plain `staff` user had no
    // restriction and could list approvals for any project in the system.
    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (requester.roleSlug === 'staff') {
      const scope = await this.accessControl.scopeProjectIdWhereForStaff(requester);
      Object.assign(where, scope);
    } else if (query.clientId) {
      where['clientId'] = query.clientId;
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

    await this.accessControl.assertProjectAccess(requester, {
      id: approval.projectId,
      clientId: approval.clientId,
    });

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

    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (requester.roleSlug === 'staff') {
      const scope = await this.accessControl.scopeProjectIdWhereForStaff(requester);
      Object.assign(where, scope);
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

    // A staff user (non agency-wide) must actually be assigned to the
    // project they're requesting approval on — previously unchecked, so
    // any staff login could create an approval (and notify a client) for
    // a project they have no business touching.
    await this.accessControl.assertProjectAccess(requester, {
      id: dto.projectId,
      clientId: dto.clientId,
    });

    const approval = await this.approvalModel.create({
      ...dto,
      status: ApprovalStatus.PENDING,
      requestedBy: requester.id,
      requestedAt: new Date(),
    } as any);

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
}
