import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { Client } from '@/modules/clients/models/client.model';
import { PaymentTransaction } from './payment-transaction.model';

export type InvoiceStatus =
  'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

@Table({
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Invoice extends Model<Invoice> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(40),
    unique: true,
    allowNull: false,
  })
  declare invoice_number: string;

  // ─────────────────────────────────────────────
  // Client
  // ─────────────────────────────────────────────

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare client_id: string;

  // ─────────────────────────────────────────────
  // Project
  // ─────────────────────────────────────────────

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare project_id: string | null;

  // ─────────────────────────────────────────────
  // Financials
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount_paid: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    defaultValue: 'INR',
  })
  declare currency: string;

  @Column({
    type: DataType.ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: InvoiceStatus;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare issue_date: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare due_date: string;

  // ─────────────────────────────────────────────
  // Created By
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare created_by: string | null;

  // ─────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // ─────────────────────────────────────────────
  // Relationships
  // ─────────────────────────────────────────────

  @BelongsTo(() => Client, 'client_id')
  declare client: Client;

  @BelongsTo(() => Project, 'project_id')
  declare project: Project;

  @BelongsTo(() => User, 'created_by')
  declare creator: User;

  @HasMany(() => PaymentTransaction, 'invoice_id')
  declare transactions: PaymentTransaction[];
}
