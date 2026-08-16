import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { RsvpStatus } from '@/common/enums/index.enum';
import { Event } from './event.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'event_attendees',
  timestamps: false,
})
export class EventAttendee extends Model<EventAttendee> {
  @ForeignKey(() => Event)
  @Column({
    type: DataType.UUID,
    field: 'event_id',
    primaryKey: true,
    allowNull: false,
  })
  declare eventId: string;

  @BelongsTo(() => Event, 'eventId')
  declare event: Event;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    primaryKey: true,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @Column({
    type: DataType.ENUM(...Object.values(RsvpStatus)),
    field: 'rsvp_status',
    allowNull: false,
    defaultValue: RsvpStatus.INVITED,
  })
  declare rsvpStatus: RsvpStatus;
}
