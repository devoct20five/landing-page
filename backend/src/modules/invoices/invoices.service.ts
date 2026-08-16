import {
  BadRequestException,
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
    return this.findOne(invoice.id);
  }

  async findAll(query: QueryInvoiceDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.client_id) where.client_id = query.client_id;
    if (query.project_id) where.project_id = query.project_id;
    if (query.search) {
      where[Op.or] = [
        { invoice_number: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
      ];
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

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id, { include: INCLUDE });
    if (!invoice) throw new NotFoundException(`Invoice #${id} not found`);
    return invoice;
  }

  /** Invoice + payment history for a single project (client "pay for project" screen). */
  async findByProject(projectId: number) {
    return this.invoiceModel.findAll({
      where: { project_id: projectId },
      include: INCLUDE,
      order: [['created_at', 'DESC']],
    });
  }

  async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    await invoice.update({ ...dto });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await invoice.destroy();
  }

  /** Records a payment transaction and rolls it into the invoice's amount_paid / status. */
  async recordPayment(
    invoiceId: number,
    dto: CreatePaymentDto,
  ): Promise<Invoice> {
    const invoice = await this.findOne(invoiceId);

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

    return this.findOne(invoiceId);
  }

  async listTransactions(invoiceId: number): Promise<PaymentTransaction[]> {
    await this.findOne(invoiceId); // 404 guard
    return this.paymentModel.findAll({
      where: { invoice_id: invoiceId },
      order: [['created_at', 'DESC']],
    });
  }

  /** Revenue KPIs for the admin Payments dashboard. */
  async revenueStats(clientId?: number) {
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
