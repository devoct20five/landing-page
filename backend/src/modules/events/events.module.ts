import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './models/event.model';
import { EventAttendee } from './models/event-attendee.model';

@Module({
  imports: [SequelizeModule.forFeature([Event, EventAttendee])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
