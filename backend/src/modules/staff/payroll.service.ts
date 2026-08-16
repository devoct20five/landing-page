import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payroll, PayoutStatus } from './models/payroll.model';
import { User } from '../users/models/user.model';
import {
  CreatePayrollEntryDto,
  QueryPayrollDto,
  UpdatePayrollEntryDto,
} from './dto/payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(Payroll) private readonly payrollModel: typeof Payroll,
  ) {}

  async create(dto: CreatePayrollEntryDto): Promise<Payroll> {
    const existing = await this.payrollModel.findOne({
      where: {
        staffId: dto.staffId,
        periodMonth: dto.periodMonth,
        periodYear: dto.periodYear,
      },
    });
    if (existing) {
      throw new ConflictException(
        'A payroll entry already exists for this staff member and period',
      );
    }
    return this.payrollModel.create({ ...dto } as any);
  }

  /** Monthly payroll overview (3.6 Salary & Payouts). */
  async findAll(query: QueryPayrollDto) {
    const where: any = {};
    if (query.month) where.periodMonth = query.month;
    if (query.year) where.periodYear = query.year;
    if (query.status) where.payoutStatus = query.status;
    if (query.staffId) where.staffId = query.staffId;

    return this.payrollModel.findAll({
      where,
      include: [User],
      order: [
        ['periodYear', 'DESC'],
        ['periodMonth', 'DESC'],
      ],
    });
  }

  async findOne(id: number): Promise<Payroll> {
    const entry = await this.payrollModel.findByPk(id, { include: [User] });
    if (!entry) throw new NotFoundException(`Payroll entry ${id} not found`);
    return entry;
  }

  async update(id: number, dto: UpdatePayrollEntryDto): Promise<Payroll> {
    const entry = await this.findOne(id);
    await entry.update(dto);
    return entry;
  }

  /** "Process payouts" action — marks paid with today's payout_date. */
  async processPayout(id: number): Promise<Payroll> {
    const entry = await this.findOne(id);
    await entry.update({
      payoutStatus: PayoutStatus.PAID,
      payoutDate: new Date().toISOString().slice(0, 10),
    });
    return entry;
  }

  /** Bulk-process every pending/overdue entry for a period in one action. */
  async processPayoutsForPeriod(month: number, year: number): Promise<number> {
    const [count] = await this.payrollModel.update(
      {
        payoutStatus: PayoutStatus.PAID,
        payoutDate: new Date().toISOString().slice(0, 10),
      },
      {
        where: { periodMonth: month, periodYear: year },
      },
    );
    return count;
  }

  async payoutHistoryForStaff(staffId: number): Promise<Payroll[]> {
    return this.payrollModel.findAll({
      where: { staffId },
      order: [
        ['periodYear', 'DESC'],
        ['periodMonth', 'DESC'],
      ],
    });
  }
}
