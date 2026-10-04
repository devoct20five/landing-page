import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { UserType } from '@/common/enums/user-type.enum';
import type { RequestUser } from '../auth/types/authenticated-user.type';

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

  /**
   * docs/00_CURRENT_STATE_AUDIT.md §3/§45: previously trusted
   * query.clientId outright — a client could see any other client's
   * events just by passing a different clientId. Spec §45: "Client users
   * should only see events they are allowed to see." A client is now
   * restricted to their own clientId, and internal agency events
   * (clientId IS NULL) are excluded from their view entirely — those are
   * staff-only by nature.
   */
  async findAll(query: QueryEventDto, requester: RequestUser): Promise<Paginated<Event>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: WhereOptions = {};

    if (query.eventType) where['eventType'] = query.eventType;
    if (query.status) where['status'] = query.status;
    if (query.projectId) where['projectId'] = query.projectId;

    if (requester.userType === UserType.CLIENT) {
      where['clientId'] = requester.clientId ?? '00000000-0000-0000-0000-000000000000';
    } else if (query.clientId) {
      where['clientId'] = query.clientId;
    }
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

  private async findOneUnscoped(id: string): Promise<Event> {
    const event = await this.eventModel.findByPk(id, {
      include: [ATTENDEE_INCLUDE],
    });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async findOne(id: string, requester: RequestUser): Promise<Event> {
    const event = await this.findOneUnscoped(id);
    if (requester.userType === UserType.CLIENT) {
      if (!event.clientId || event.clientId !== requester.clientId) {
        throw new ForbiddenException('You do not have access to this event.');
      }
    }
    return event;
  }

  async create(dto: CreateEventDto, createdBy: string): Promise<Event> {
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

    return this.findOneUnscoped(event.id);
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOneUnscoped(id);
    await event.update(dto);
    return this.findOneUnscoped(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOneUnscoped(id);
    await event.destroy();
  }

  async addAttendees(
    eventId: string,
    dto: AddAttendeesDto,
  ): Promise<EventAttendee[]> {
    await this.findOneUnscoped(eventId);
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

  async removeAttendee(eventId: string, userId: string): Promise<void> {
    await this.attendeeModel.destroy({ where: { eventId, userId } });
  }

  async rsvp(
    eventId: string,
    userId: string,
    status: RsvpStatus,
  ): Promise<EventAttendee> {
    const link = await this.attendeeModel.findOne({
      where: { eventId, userId },
    });
    if (!link) throw new NotFoundException('You are not invited to this event');
    await link.update({ rsvpStatus: status });
    return link;
  }

  private async findAttendeeEventIds(userId: string): Promise<string[]> {
    const links = await this.attendeeModel.findAll({
      where: { userId },
      attributes: ['eventId'],
    });
    return links.map((l) => l.eventId);
  }
}
