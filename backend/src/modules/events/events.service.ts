import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Event } from './models/event.model';
import { EventAttendee } from './models/event-attendee.model';
import { User } from '../users/models/user.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { AddAttendeesDto } from './dto/add-attendees.dto';
import { paginate, Paginated } from '@/common/dto/pagination-query.dto';
import { RsvpStatus } from '@/common/enums/index.enum';

const ATTENDEE_INCLUDE = {
  model: EventAttendee,
  include: [
    { model: User, attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
  ],
};

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private readonly eventModel: typeof Event,
    @InjectModel(EventAttendee)
    private readonly attendeeModel: typeof EventAttendee,
  ) {}

  async findAll(query: QueryEventDto): Promise<Paginated<Event>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: WhereOptions = {};

    if (query.eventType) where['eventType'] = query.eventType;
    if (query.status) where['status'] = query.status;
    if (query.clientId) where['clientId'] = query.clientId;
    if (query.projectId) where['projectId'] = query.projectId;
    if (query.from || query.to) {
      where['eventDate'] = {
        ...(query.from ? { [Op.gte]: query.from } : {}),
        ...(query.to ? { [Op.lte]: query.to } : {}),
      };
    }

    // Filtering by attendee is resolved as a plain id-in-list rather than a second join
    // alias to the same association, keeping the query and includes simple.
    if (query.attendeeUserId) {
      where['id'] = {
        [Op.in]: await this.findAttendeeEventIds(query.attendeeUserId),
      };
    }

    const { rows, count } = await this.eventModel.findAndCountAll({
      where,
      include: [ATTENDEE_INCLUDE],
      order: [
        ['eventDate', 'ASC'],
        ['startTime', 'ASC'],
      ],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return paginate(rows, count, page, limit);
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventModel.findByPk(id, {
      include: [ATTENDEE_INCLUDE],
    });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async create(dto: CreateEventDto, createdBy: number): Promise<Event> {
    const { attendeeUserIds, ...rest } = dto;
    const event = await this.eventModel.create({ ...rest, createdBy } as any);

    if (attendeeUserIds?.length) {
      await this.attendeeModel.bulkCreate(
        attendeeUserIds.map((userId) => ({
          eventId: event.id,
          userId,
          rsvpStatus: RsvpStatus.INVITED,
        })) as any[],
      );
    }

    return this.findOne(event.id);
  }

  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    await event.update(dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await event.destroy();
  }

  async addAttendees(
    eventId: number,
    dto: AddAttendeesDto,
  ): Promise<EventAttendee[]> {
    await this.findOne(eventId);
    await this.attendeeModel.bulkCreate(
      dto.userIds.map((userId) => ({
        eventId,
        userId,
        rsvpStatus: RsvpStatus.INVITED,
      })) as any[],
      { ignoreDuplicates: true },
    );
    return this.attendeeModel.findAll({
      where: { eventId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
      ],
    });
  }

  async removeAttendee(eventId: number, userId: number): Promise<void> {
    await this.attendeeModel.destroy({ where: { eventId, userId } });
  }

  async rsvp(
    eventId: number,
    userId: number,
    status: RsvpStatus,
  ): Promise<EventAttendee> {
    const link = await this.attendeeModel.findOne({
      where: { eventId, userId },
    });
    if (!link) throw new NotFoundException('You are not invited to this event');
    await link.update({ rsvpStatus: status });
    return link;
  }

  private async findAttendeeEventIds(userId: number): Promise<number[]> {
    const links = await this.attendeeModel.findAll({
      where: { userId },
      attributes: ['eventId'],
    });
    return links.map((l) => l.eventId);
  }
}
