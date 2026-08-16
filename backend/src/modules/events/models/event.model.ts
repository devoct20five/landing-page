import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { EventStatus, EventType } from '@/common/enums/index.enum';
import { Client } from '@/modules/clients/models/client.model';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { EventAttendee } from './event-attendee.model';

@Table({
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class Event extends Model<Event> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(EventType)),
    field: 'event_type',
    allowNull: false,
    defaultValue: EventType.MEETING,
  })
  declare eventType: EventType;

  @Column({
    type: DataType.DATEONLY,
    field: 'event_date',
    allowNull: false,
  })
  declare eventDate: string;

  @Column({
    type: DataType.TIME,
    field: 'start_time',
    allowNull: true,
  })
  declare startTime: string | null;

  @Column({
    type: DataType.TIME,
    field: 'end_time',
    allowNull: true,
  })
  declare endTime: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare location: string | null;

  @Column({
    type: DataType.STRING(500),
    field: 'meeting_link',
    allowNull: true,
  })
  declare meetingLink: string | null;

  // ─────────────────────────────────────────────
  // Client
  // ─────────────────────────────────────────────

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
    allowNull: true,
  })
  declare clientId: string | null;

  @BelongsTo(() => Client, 'clientId')
  declare client: Client;

  // ─────────────────────────────────────────────
  // Project
  // ─────────────────────────────────────────────

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
    allowNull: true,
  })
  declare projectId: string | null;

  @BelongsTo(() => Project, 'projectId')
  declare project: Project;

  // ─────────────────────────────────────────────
  // Status
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.ENUM(...Object.values(EventStatus)),
    allowNull: false,
    defaultValue: EventStatus.SCHEDULED,
  })
  declare status: EventStatus;

  // ─────────────────────────────────────────────
  // Creator
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'created_by',
    allowNull: true,
  })
  declare createdBy: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: User;

  // ─────────────────────────────────────────────
  // Attendees
  // ─────────────────────────────────────────────

  @HasMany(() => EventAttendee, 'eventId')
  declare attendeeLinks: EventAttendee[];

  @BelongsToMany(() => User, () => EventAttendee)
  declare attendees: User[];
}
