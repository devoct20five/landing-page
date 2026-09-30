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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  CreateClientContactDto,
  UpdateClientContactDto,
} from './dto/client-contact.dto';
import { QueryClientDto } from './dto/query-client.dto';

// NOTE: Wire in your auth/RBAC guards (roles: admin/manager) per route —
// omitted here so the module can be dropped in regardless of your auth setup.
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryClientDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Get(':id/stats')
  stats(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.statsFor(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }

  // -- contacts -----------------------------------------------------------

  @Post(':id/contacts')
  addContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateClientContactDto,
  ) {
    return this.clientsService.addContact(id, dto);
  }

  @Get(':id/contacts')
  listContacts(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.listContacts(id);
  }

  @Patch(':id/contacts/:contactId')
  updateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: UpdateClientContactDto,
  ) {
    return this.clientsService.updateContact(id, contactId, dto);
  }

  @Delete(':id/contacts/:contactId')
  removeContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.clientsService.removeContact(id, contactId);
  }
}
