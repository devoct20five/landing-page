import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import {
  AuthenticatedUser,
  RequestUser,
} from '../../modules/auth/types/authenticated-user.type';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

/**
 * Pulls the authenticated user attached by JwtAuthGuard
 * from `request.user`.
 *
 * Usage:
 *
 * findMe(@CurrentUser() user: AuthenticatedUser)
 *
 * findMyId(@CurrentUser('id') id: number)
 *
 * findMyEmail(@CurrentUser('email') email: string)
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
