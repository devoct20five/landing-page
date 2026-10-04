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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

// Same fix as roles/permissions/staff controllers: dropped
// @Roles(UserType.ADMIN), which would have silently blocked manager's
// 'team.view'/'team.edit' catalog grants — spec §29's authorization
// matrix lists manager as "Limited" access to user management, not
// blocked outright. The permission system alone is authoritative here.
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin "Users" tab (3.6) - list/search all accounts across portals.
  @Get()
  @RequirePermissions('team.view')
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  // Self-service "Settings > Profile" (1.7 / staff equivalent) for any
  // logged-in user — intentionally no permission decorator; this is
  // available to every authenticated user regardless of role.
  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @RequirePermissions('team.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // Admin "Onboarding > invite new user" (3.6) creates the account directly here;
  // a separate invite-token flow can wrap this later if you want email-first onboarding.
  @Post()
  @RequirePermissions('team.edit')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // UpdateMyProfileDto, not UpdateUserDto — see that DTO's own comment.
  // Using the admin DTO here (which includes roleId/status) on an
  // intentionally permission-free self-service route would let any
  // logged-in user set their own roleId to an admin role's id.
  @Patch('me')
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateMyProfileDto) {
    return this.usersService.update(user.id, dto);
  }

  @Patch('me/password')
  changeMyPassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Patch(':id')
  @RequirePermissions('team.edit')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('team.edit')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
