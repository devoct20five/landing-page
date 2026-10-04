import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { AddAttendeesDto } from './dto/add-attendees.dto';
import { RsvpEventDto } from './dto/rsvp-event.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @RequirePermissions('events.view')
  findAll(@Query() query: QueryEventDto, @CurrentUser() user: RequestUser) {
    return this.eventsService.findAll(query, user);
  }

  @Get(':id')
  @RequirePermissions('events.view')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.eventsService.findOne(id, user);
  }

  @Post()
  @RequirePermissions('events.create')
  create(@Body() dto: CreateEventDto, @CurrentUser() user: RequestUser) {
    return this.eventsService.create(dto, user.id);
  }

  @Patch(':id')
  @RequirePermissions('events.edit')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('events.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/attendees')
  @RequirePermissions('events.edit')
  addAttendees(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddAttendeesDto,
  ) {
    return this.eventsService.addAttendees(id, dto);
  }

  @Delete(':id/attendees/:userId')
  @RequirePermissions('events.edit')
  removeAttendee(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.eventsService.removeAttendee(id, userId);
  }

  /** The current user responds to their own invite — no events.edit needed, it's self-service. */
  @Patch(':id/rsvp')
  @RequirePermissions('events.view')
  rsvp(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RsvpEventDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.eventsService.rsvp(id, user.id, dto.rsvpStatus);
  }
}
