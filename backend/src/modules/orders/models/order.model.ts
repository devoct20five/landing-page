import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Client } from '../../clients/models/client.model';
import { User } from '../../users/models/user.model';
import { Project } from '../../projects/models/project.model';
import { Invoice } from '../../invoices/models/invoice.model';
import { OrderPayment } from './order-payment.model';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
export type ProvisioningStatus = 'not_started' | 'done' | 'manual_review';

const money = (name: string) => ({ type: DataType.DECIMAL(12, 2), allowNull: false, field: name }) as const;

/** The commercial record of a purchase. Price fields are a SNAPSHOT taken at creation. */
@Table({ tableName: 'orders', timestamps: true, underscored: true })
export class Order extends Model<Order> {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(30), field: 'order_number', unique: true })
  declare orderNumber: string;

  @Default(OrderStatus.PENDING)
  @Column({ type: DataType.ENUM(...Object.values(OrderStatus)), allowNull: false })
  declare status: OrderStatus;

  @Default('not_started')
  @Column({ type: DataType.ENUM('not_started', 'done', 'manual_review'), allowNull: false, field: 'provisioning_status' })
  declare provisioningStatus: ProvisioningStatus;

  @Column({ type: DataType.STRING(500), allowNull: true, field: 'provisioning_note' })
  declare provisioningNote: string | null;

  @AllowNull(false) @Column({ type: DataType.STRING(150), field: 'buyer_name' }) declare buyerName: string;
  @AllowNull(false) @Column({ type: DataType.STRING(190), field: 'buyer_email' }) declare buyerEmail: string;
  @Column({ type: DataType.STRING(30), allowNull: true, field: 'buyer_phone' }) declare buyerPhone: string | null;
  @Column({ type: DataType.STRING(150), allowNull: true, field: 'buyer_company' }) declare buyerCompany: string | null;
  @Column({ type: DataType.STRING(20), allowNull: true, field: 'buyer_gstin' }) declare buyerGstin: string | null;
  @Column({ type: DataType.TEXT, allowNull: true }) declare notes: string | null;

  @ForeignKey(() => Client) @Column({ type: DataType.UUID, allowNull: true, field: 'client_id' }) declare clientId: string | null;
  @BelongsTo(() => Client, 'clientId') declare client: Client;
  @ForeignKey(() => User) @Column({ type: DataType.UUID, allowNull: true, field: 'user_id' }) declare userId: string | null;
  @ForeignKey(() => Project) @Column({ type: DataType.UUID, allowNull: true, field: 'project_id' }) declare projectId: string | null;
  @BelongsTo(() => Project, 'projectId') declare project: Project;
  @ForeignKey(() => Invoice) @Column({ type: DataType.UUID, allowNull: true, field: 'invoice_id' }) declare invoiceId: string | null;
  @BelongsTo(() => Invoice, 'invoiceId') declare invoice: Invoice;

  @Column({ type: DataType.UUID, allowNull: true, field: 'service_id' }) declare serviceId: string | null;
  @Column({ type: DataType.UUID, allowNull: true, field: 'plan_id' }) declare planId: string | null;
  @Column({ type: DataType.UUID, allowNull: true, field: 'pack_id' }) declare packId: string | null;

  // ---- commercial snapshot ----
  @AllowNull(false) @Column({ type: DataType.STRING(100), field: 'service_name' }) declare serviceName: string;
  @AllowNull(false) @Column({ type: DataType.STRING(100), field: 'plan_name' }) declare planName: string;
  @Column({ type: DataType.STRING(50), allowNull: true, field: 'pack_label' }) declare packLabel: string | null;
  @Default(1) @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false }) declare quantity: number;
  @Column(money('unit_price')) declare unitPrice: number;
  @Column(money('list_price')) declare listPrice: number;
  @Default(0) @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, field: 'pack_discount_percent' }) declare packDiscountPercent: number;
  @Default(0) @Column(money('pack_discount')) declare packDiscount: number;
  @Column({ type: DataType.JSON, allowNull: true }) declare addons: Array<{ code: string; label: string; price: number }> | null;
  @Default(0) @Column(money('addons_total')) declare addonsTotal: number;
  @Column({ type: DataType.STRING(40), allowNull: true, field: 'promo_code' }) declare promoCode: string | null;
  @Default(0) @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, field: 'promo_percent' }) declare promoPercent: number;
  @Default(0) @Column(money('promo_discount')) declare promoDiscount: number;
  @Column(money('subtotal')) declare subtotal: number;
  @Default(0) @Column({ type: DataType.DECIMAL(5, 4), allowNull: false, field: 'tax_rate' }) declare taxRate: number;
  @Default(0) @Column(money('tax_amount')) declare taxAmount: number;
  @Column(money('total')) declare total: number;
  @Default('INR') @Column({ type: DataType.STRING(10), allowNull: false }) declare currency: string;
  @Column({ type: DataType.JSON, allowNull: true, field: 'features_snapshot' }) declare featuresSnapshot: string[] | null;

  @Column({ type: DataType.STRING(80), allowNull: true, unique: true, field: 'idempotency_key' }) declare idempotencyKey: string | null;
  @Column({ type: DataType.DATE, allowNull: true, field: 'paid_at' }) declare paidAt: Date | null;
  @Column({ type: DataType.DATE, allowNull: true, field: 'failed_at' }) declare failedAt: Date | null;
  @Column({ type: DataType.DATE, allowNull: true, field: 'cancelled_at' }) declare cancelledAt: Date | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'failure_reason' }) declare failureReason: string | null;

  @HasMany(() => OrderPayment, 'orderId') declare payments: OrderPayment[];
}
