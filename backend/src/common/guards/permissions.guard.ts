import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../../modules/auth/types/authenticated-user.type';

/**
 * Fine-grained gate matching the `permissions` table (module.action slugs
 * such as "projects.view", "payments.edit"). Requires ALL listed permissions.
 * Admins with an "is_system" super-admin role can be special-cased here if
 * you want a wildcard bypass - left explicit for now so nothing is implicit.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUser }>();

    const granted = new Set(user?.permissions ?? []);
    const missing = required.filter((slug) => !granted.has(slug));

    if (missing.length > 0) {
      throw new ForbiddenException(
        `Missing required permission(s): ${missing.join(', ')}`,
      );
    }

    return true;
  }
}
