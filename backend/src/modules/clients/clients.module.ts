import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { ClientContact } from './models/client-contact.model';
import { User } from '../users/models/user.model';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

@Module({
  imports: [SequelizeModule.forFeature([Client, ClientContact, User])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService, SequelizeModule],
})
export class ClientsModule {}
