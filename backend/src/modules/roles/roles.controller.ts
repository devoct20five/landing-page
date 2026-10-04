import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

// Role administration (feature-list 3.6 "Roles" tab, spec §28).
//
// Previously hard-gated with @Roles(UserType.ADMIN) at the class level,
// which silently overrode the permission system below it: the catalog
// grants manager a read-only 'roles.view' grant (spec's authorization
// matrix implies manager should at least see the role/permission
// structure, not blindly edit it), but manager's userType is 'staff', so
// @Roles(UserType.ADMIN) would have blocked them regardless of having the
// permission — two authorization layers disagreeing, with the coarser
// one winning silently. Removed in favor of the permission system alone
// being authoritative here (docs/00_CURRENT_STATE_AUDIT.md §55: "no
// duplicate authorization logic"). Routes were also using `team.*`
// permissions (meant for staff-directory management) instead of the
// `roles.*` permissions already defined for this exact surface —
// corrected below. System-role deletion protection (is_system) is
// enforced in RolesService.remove(), not here.
@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('roles.view')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('roles.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @RequirePermissions('roles.manage')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('roles.manage')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Put(':id/permissions')
  @RequirePermissions('roles.manage')
  setPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.setPermissions(id, dto.permissionIds);
  }

  @Delete(':id')
  @RequirePermissions('roles.manage')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
