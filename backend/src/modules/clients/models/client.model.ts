import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { ClientStatus } from '@/common/enums/index.enum';
import { User } from '@/modules/users/models/user.model';
import { ClientContact } from './client-contact.model';
import { Project } from '../../projects/models/project.model';

@Table({
  tableName: 'clients',
  timestamps: true,
  underscored: true,
})
export class Client extends Model<Client> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare shortName: string | null;

  @Column({
    type: DataType.STRING(190),
    allowNull: true,
  })
  declare email: string | null;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare phone: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare website: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare industry: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare address: string | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare logoUrl: string | null;

  @Default(ClientStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(ClientStatus)),
    allowNull: false,
  })
  declare status: ClientStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare createdBy: string;

  @BelongsTo(() => User, 'createdBy')
  declare creator: User;

  @HasMany(() => ClientContact, 'clientId')
  declare contacts: ClientContact[];

  @HasMany(() => Project, 'clientId')
  declare projects: Project[];
}
