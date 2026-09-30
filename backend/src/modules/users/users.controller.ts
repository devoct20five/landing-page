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
import { QueryUserDto } from './dto/query-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserType } from '../../common/enums/user-type.enum';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin "Users" tab (3.6) - list/search all accounts across portals.
  @Get()
  @Roles(UserType.ADMIN)
  @RequirePermissions('team.view')
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  // Self-service "Settings > Profile" (1.7 / staff equivalent) for any logged-in user.
  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @Roles(UserType.ADMIN)
  @RequirePermissions('team.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // Admin "Onboarding > invite new user" (3.6) creates the account directly here;
  // a separate invite-token flow can wrap this later if you want email-first onboarding.
  @Post()
  @Roles(UserType.ADMIN)
  @RequirePermissions('team.edit')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateUserDto) {
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
  @Roles(UserType.ADMIN)
  @RequirePermissions('team.edit')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  @RequirePermissions('team.edit')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
