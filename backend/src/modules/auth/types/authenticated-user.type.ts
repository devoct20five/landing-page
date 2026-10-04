import { UserType } from '@/common/enums/user-type.enum';

/**
 * What ends up on `request.user` after JwtAuthGuard runs.
 *
 * Built by JwtStrategy.validate() from the JWT payload.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  userType: UserType;
  roleId: string;
  roleSlug: string;

  /**
   * Only set for userType === CLIENT, resolved from the user's ClientContact
   * row at login. Every client-scoping check in the app (approvals, tasks)
   * reads this — see ClientsService.findClientIdForUser.
   */
  clientId?: string;

  /**
   * Flattened permission slugs for this role.
   *
   * Example:
   * ['projects.view', 'tasks.edit']
   */
  permissions: string[];
}

/**
 * Alias used when referring specifically to the
 * authenticated user attached to the Express request.
 */
export type RequestUser = AuthenticatedUser;

/**
 * What we sign into the JWT itself.
 *
 * Kept slim; permissions are embedded so PermissionsGuard
 * can check them without a DB hit on every request.
 *
 * This trades a small amount of staleness
 * (permissions change -> user must re-login or refresh token)
 * for stateless, fast auth checks.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  userType: UserType;
  roleId: string;
  roleSlug: string;
  /** Only present for userType === CLIENT. See AuthenticatedUser.clientId. */
  clientId?: string;
  permissions: string[];
}
