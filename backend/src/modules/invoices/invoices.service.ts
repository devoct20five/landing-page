import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Client } from '../clients/models/client.model';
import { Project } from '../projects/models/project.model';
import { User } from '../users/models/user.model';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './models/invoice.model';
import { PaymentTransaction } from './models/payment-transaction.model';
import { AccessControlService } from '@/common/access-control/access-control.service';
import { UserType } from '@/common/enums/user-type.enum';
import type { RequestUser } from '../auth/types/authenticated-user.type';

const INCLUDE = [
  { model: Client, attributes: ['id', 'name', 'short_name', 'logo_url'] },
  { model: Project, attributes: ['id', 'name'] },
  { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
  { model: PaymentTransaction, as: 'transactions' },
];

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice) private readonly invoiceModel: typeof Invoice,
    @InjectModel(PaymentTransaction)
    private readonly paymentModel: typeof PaymentTransaction,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const existing = await this.invoiceModel.findOne({
      where: { invoice_number: dto.invoice_number },
    });
    if (existing) {
      throw new BadRequestException(
        `Invoice number "${dto.invoice_number}" already exists`,
      );
    }
    const invoice = await this.invoiceModel.create({ ...dto } as any);
    return this.findOneUnscoped(invoice.id);
  }

  /**
   * docs/00_CURRENT_STATE_AUDIT.md §41: this previously had NO scoping at
   * all — not even the client-side check Tasks/Approvals already had.
   * Any authenticated user, including a client, could list every invoice
   * in the system by leaving client_id off the query. Finance data is
   * exactly the case spec §41 warns about: "never expose financial data
   * merely because a user can access the project."
   */
  async findAll(query: QueryInvoiceDto, requester: RequestUser) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.project_id) where.project_id = query.project_id;
    if (query.search) {
      where[Op.or] = [
        { invoice_number: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
      ];
    }

    if (requester.userType === UserType.CLIENT) {
      where.client_id = requester.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (requester.roleSlug === 'staff') {
      // Plain staff have no invoices.view grant in the permission catalog
      // today (finance is manager/admin/client only — spec §41), so this
      // branch is currently unreachable via the guard. Kept as
      // defense-in-depth in case that grant is ever loosened later,
      // scoped the same way Tasks/Approvals/Projects are.
      const scope = await this.accessControl.scopeProjectIdWhereForStaff(
        requester,
        'project_id',
      );
      Object.assign(where, scope);
    } else if (query.client_id) {
      where.client_id = query.client_id;
    }

    const { rows, count } = await this.invoiceModel.findAndCountAll({
      where,
      include: INCLUDE,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  /** Fetches an invoice with no access check — internal use only (after create). */
  private async findOneUnscoped(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id, { include: INCLUDE });
    if (!invoice) throw new NotFoundException(`Invoice #${id} not found`);
    return invoice;
  }

  async findOne(id: string, requester: RequestUser): Promise<Invoice> {
    const invoice = await this.findOneUnscoped(id);
    this.accessControl.assertClientAccess(requester, invoice.client_id);
    return invoice;
  }

  /** Invoice + payment history for a single project (client "pay for project" screen). */
  async findByProject(projectId: string, requester: RequestUser) {
    const invoices = await this.invoiceModel.findAll({
      where: { project_id: projectId },
      include: INCLUDE,
      order: [['created_at', 'DESC']],
    });
    // Every invoice on a given project belongs to the same client, so one
    // check on the first row (if any) covers the whole list.
    if (invoices[0]) this.accessControl.assertClientAccess(requester, invoices[0].client_id);
    return invoices;
  }

  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOneUnscoped(id);
    await invoice.update({ ...dto });
    return this.findOneUnscoped(id);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOneUnscoped(id);
    await invoice.destroy();
  }

  /** Records a payment transaction and rolls it into the invoice's amount_paid / status. */
  async recordPayment(
    invoiceId: string,
    dto: CreatePaymentDto,
    requester: RequestUser,
  ): Promise<Invoice> {
    if (requester.userType === UserType.CLIENT) {
      // Clients pay through the gateway; they must never mark their own invoice paid.
      throw new ForbiddenException('Payments are recorded by the agency');
    }
    const invoice = await this.findOneUnscoped(invoiceId);
    this.accessControl.assertClientAccess(requester, invoice.client_id);

    const txn = await this.paymentModel.create({
      invoice_id: invoiceId,
      amount: dto.amount,
      method: dto.method,
      reference: dto.reference,
      paid_at: dto.paid_at ?? new Date(),
      status: dto.status ?? 'success',
    } as any);

    if (txn.status === 'success') {
      const newAmountPaid = Number(invoice.amount_paid) + Number(dto.amount);
      const status =
        newAmountPaid >= Number(invoice.amount)
          ? 'paid'
          : invoice.status === 'draft'
            ? 'pending'
            : invoice.status;

      await invoice.update({ amount_paid: newAmountPaid, status });
    }

    return this.findOneUnscoped(invoiceId);
  }

  async listTransactions(
    invoiceId: string,
    requester: RequestUser,
  ): Promise<PaymentTransaction[]> {
    const invoice = await this.findOneUnscoped(invoiceId);
    this.accessControl.assertClientAccess(requester, invoice.client_id);
    return this.paymentModel.findAll({
      where: { invoice_id: invoiceId },
      order: [['created_at', 'DESC']],
    });
  }

  /** Revenue KPIs for the admin Payments dashboard — agency-wide roles only (route-gated). */
  async revenueStats(clientId?: string) {
    const where: any = clientId ? { client_id: clientId } : {};

    const invoices = await this.invoiceModel.findAll({
      where,
      attributes: ['amount', 'amount_paid', 'status'],
    });

    const stats = invoices.reduce(
      (acc, inv) => {
        acc.totalInvoiced += Number(inv.amount);
        acc.totalPaid += Number(inv.amount_paid);
        if (inv.status === 'pending')
          acc.totalPending += Number(inv.amount) - Number(inv.amount_paid);
        if (inv.status === 'overdue')
          acc.totalOverdue += Number(inv.amount) - Number(inv.amount_paid);
        return acc;
      },
      { totalInvoiced: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0 },
    );

    return stats;
  }
}
