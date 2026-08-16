import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Restricts a route to users whose role holds ALL of the given permission
 * slugs (module.action, e.g. "projects.view", "payments.edit").
 * Usage: @RequirePermissions('projects.view', 'projects.edit')
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
