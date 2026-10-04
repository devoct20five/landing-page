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
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

// Pure agency-management surface (admin/manager) — a client user never
// calls these routes for their own data; every client-facing endpoint
// elsewhere (projects, invoices, approvals, ...) resolves the caller's
// own clientId from the JWT instead. See docs/00_CURRENT_STATE_AUDIT.md
// §89 ("the client portal is a tenant").
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @RequirePermissions('clients.create')
  create(@Body() dto: CreateClientDto, @CurrentUser() user: RequestUser) {
    return this.clientsService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('clients.view')
  findAll(@Query() query: QueryClientDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('clients.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Get(':id/stats')
  @RequirePermissions('clients.view')
  stats(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.statsFor(id);
  }

  @Patch(':id')
  @RequirePermissions('clients.edit')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('clients.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }

  // -- contacts -----------------------------------------------------------

  @Post(':id/contacts')
  @RequirePermissions('clients.edit')
  addContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateClientContactDto,
  ) {
    return this.clientsService.addContact(id, dto);
  }

  @Get(':id/contacts')
  @RequirePermissions('clients.view')
  listContacts(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.listContacts(id);
  }

  @Patch(':id/contacts/:contactId')
  @RequirePermissions('clients.edit')
  updateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: UpdateClientContactDto,
  ) {
    return this.clientsService.updateContact(id, contactId, dto);
  }

  @Delete(':id/contacts/:contactId')
  @RequirePermissions('clients.edit')
  removeContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.clientsService.removeContact(id, contactId);
  }
}
