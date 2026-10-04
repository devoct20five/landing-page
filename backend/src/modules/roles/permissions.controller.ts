import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

// Same fix as roles.controller.ts: dropped the @Roles(UserType.ADMIN)
// class gate (which would have silently blocked manager's 'permissions.view'
// catalog grant) and corrected team.* -> permissions.* permission slugs.
@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions('permissions.view')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Post()
  @RequirePermissions('roles.manage')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Delete(':id')
  @RequirePermissions('roles.manage')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.remove(id);
  }
}
