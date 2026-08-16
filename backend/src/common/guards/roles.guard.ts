import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserType } from '../enums/user-type.enum';
import { AuthenticatedUser } from '../../modules/auth/types/authenticated-user.type';

/**
 * Coarse-grained "which portal" gate. Runs after JwtAuthGuard, so
 * request.user is already populated.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no restriction declared -> open to any authenticated user
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();

    if (!user || !requiredRoles.includes(user.userType)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
