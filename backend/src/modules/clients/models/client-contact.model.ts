import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@/modules/users/models/user.model';
import { Client } from './client.model';

/**
 * A company (client) can have several logins.
 *
 * This joins `users` (user_type='client')
 * to the `clients` company record.
 */
@Table({
  tableName: 'client_contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['client_id', 'user_id'],
    },
  ],
})
export class ClientContact extends Model<ClientContact> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
  })
  declare clientId: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare designation: string | null;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isPrimary: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @BelongsTo(() => Client, 'clientId')
  declare client: Client;

  @BelongsTo(() => User, 'userId')
  declare user: User;
}
