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
import type { RequestUser } from '../auth/types/authenticated-user.type';
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: RequestUser) {
    return this.eventsService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/attendees')
  addAttendees(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddAttendeesDto,
  ) {
    return this.eventsService.addAttendees(id, dto);
  }

  @Delete(':id/attendees/:userId')
  removeAttendee(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.eventsService.removeAttendee(id, userId);
  }

  /** The current user responds to their own invite. */
  @Patch(':id/rsvp')
  rsvp(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RsvpEventDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.eventsService.rsvp(id, user.id, dto.rsvpStatus);
  }
}
