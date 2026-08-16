import { SetMetadata } from '@nestjs/common';
import { UserType } from '../enums/user-type.enum';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to specific user_type values (client / staff / admin).
 * This is the coarse-grained gate (which "portal" can call this endpoint).
 * Usage: @Roles(UserType.ADMIN, UserType.STAFF)
 */
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
