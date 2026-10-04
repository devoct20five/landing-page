import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectTeamMember } from '@/modules/projects/models/project-team-member.model';
import { Project } from '@/modules/projects/models/project.model';
import { Folder } from '@/modules/files/models/folder.model';
import { UserType } from '@/common/enums/user-type.enum';
import type { RequestUser } from '@/modules/auth/types/authenticated-user.type';

/**
 * Central place for "can this JWT-authenticated user touch this resource"
 * checks, so authorization logic doesn't get re-implemented (and
 * re-forgotten) in every controller/service.
 *
 * See docs/00_CURRENT_STATE_AUDIT.md §2/§3/§11/§86 — before this existed,
 * ProjectsService/FilesController trusted clientId/staffId from query
 * params/URLs instead of the authenticated user, which is the textbook
 * IDOR pattern. Every method here takes the resolved `RequestUser` from
 * `@CurrentUser()`, never anything the caller supplied.
 *
 * Model: three tiers, matching the JWT's roleSlug —
 *   - admin / manager: agency-wide access, gated by @RequirePermissions()
 *     on the route, not by tenancy. (Per spec §87/§88: this is a
 *     permission-based allowance, not a `userType === 'admin'` bypass —
 *     an admin with the 'projects.view' permission stripped would still
 *     be blocked by the guard before any of these methods run.)
 *   - staff: scoped to projects they're an assigned team member on.
 *   - client: scoped to their own client company (resolved via
 *     ClientContact at login, carried as `user.clientId` on the JWT —
 *     never trust a clientId the client supplies themselves).
 */
@Injectable()
export class AccessControlService {
  constructor(
    @InjectModel(ProjectTeamMember)
    private readonly teamMemberModel: typeof ProjectTeamMember,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Folder)
    private readonly folderModel: typeof Folder,
  ) {}

  private isAgencyWide(user: RequestUser): boolean {
    return user.roleSlug === 'admin' || user.roleSlug === 'manager';
  }

  /**
   * Throws unless `user` is allowed to act on the given client tenant.
   * Agency-wide roles always pass (permission-gated at the route level);
   * a client user passes only if it's their own client.
   */
  assertClientAccess(
    user: RequestUser,
    clientId: string | null | undefined,
  ): void {
    if (this.isAgencyWide(user)) return;
    if (user.userType === UserType.STAFF) return; // staff: project/task-level checks apply instead
    if (user.userType === UserType.CLIENT) {
      if (user.clientId && clientId && user.clientId === clientId) return;
      throw new ForbiddenException('You do not have access to this client.');
    }
    throw new ForbiddenException('You do not have access to this resource.');
  }

  /** Project ids a staff user is an assigned team member on. */
  async assignedProjectIds(userId: string): Promise<string[]> {
    const rows = await this.teamMemberModel.findAll({
      where: { staffId: userId },
      attributes: ['projectId'],
    });
    return rows.map((r) => r.projectId);
  }

  /**
   * Throws unless `user` may access the given project. `project` only
   * needs the two fields that matter for scoping — callers pass a
   * Sequelize instance or a plain object interchangeably.
   */
  async assertProjectAccess(
    user: RequestUser,
    project: { id: string; clientId: string },
  ): Promise<void> {
    if (this.isAgencyWide(user)) return;

    if (user.userType === UserType.CLIENT) {
      if (user.clientId && user.clientId === project.clientId) return;
      throw new ForbiddenException('You do not have access to this project.');
    }

    if (user.userType === UserType.STAFF) {
      const assigned = await this.teamMemberModel.findOne({
        where: { projectId: project.id, staffId: user.id },
      });
      if (assigned) return;
      throw new ForbiddenException('You are not assigned to this project.');
    }

    throw new ForbiddenException('You do not have access to this project.');
  }

  /**
   * A Sequelize `where` fragment that scopes a *listing* query to what
   * `user` is allowed to see, keyed by whichever column the caller's
   * model uses for the client tenant (default `clientId`).
   *
   * Agency-wide roles get `{}` (no extra restriction — permission guard
   * already gated the route). Client users get `{ [clientColumn]:
   * user.clientId }`. Staff users get nothing here — for
   * project-scoped listings use `scopeProjectIdWhereForStaff` instead,
   * since staff scoping runs through project assignment, not a direct
   * client column.
   */
  scopeByClientWhere(
    user: RequestUser,
    clientColumn = 'clientId',
  ): Record<string, unknown> {
    if (this.isAgencyWide(user)) return {};
    if (user.userType === UserType.CLIENT) {
      // No clientId on the token (shouldn't happen for a real client
      // login, but fail closed rather than return everything) -> a
      // clientId that can never match any row.
      return {
        [clientColumn]: user.clientId ?? '00000000-0000-0000-0000-000000000000',
      };
    }
    // Staff without agency-wide role: caller must use
    // scopeProjectIdWhereForStaff for project-scoped resources.
    return {};
  }

  /**
   * For staff (non-agency-wide) users, a `where` fragment restricting a
   * project-scoped listing to projects they're assigned to. Returns `{}`
   * for agency-wide roles and for clients (who should use
   * scopeByClientWhere instead).
   */
  async scopeProjectIdWhereForStaff(
    user: RequestUser,
    projectColumn = 'projectId',
  ): Promise<Record<string, unknown>> {
    if (this.isAgencyWide(user) || user.userType !== UserType.STAFF) return {};
    const ids = await this.assignedProjectIds(user.id);
    // Empty assignment list must still restrict results to nothing, not
    // fall through to "no filter" (Op.in: [] correctly matches zero rows).
    return { [projectColumn]: { [Op.in]: ids } };
  }

  /**
   * Resolves the project a file belongs to, either directly (file.projectId)
   * or through its folder (folder.projectId) — a file uploaded into a
   * folder doesn't always get its own projectId set redundantly.
   */
  private async resolveFileProject(file: {
    projectId: string | null;
    folderId: string | null;
  }): Promise<{ id: string; clientId: string } | null> {
    let projectId = file.projectId;
    if (!projectId && file.folderId) {
      const folder = await this.folderModel.findByPk(file.folderId, {
        attributes: ['projectId'],
      });
      projectId = folder?.projectId ?? null;
    }
    if (!projectId) return null;
    const project = await this.projectModel.findByPk(projectId, {
      attributes: ['id', 'clientId'],
    });
    return project ? { id: project.id, clientId: project.clientId } : null;
  }

  /**
   * Throws unless `user` may view/download the given file.
   *
   * docs/00_CURRENT_STATE_AUDIT.md §3/§38/§39: FilesController.download()
   * used to stream any file back to any authenticated user who knew or
   * guessed its UUID — findOne(id) with no ownership check at all. This
   * closes that: a file with no resolvable project (not in a project or
   * project-linked folder) fails closed to agency-wide roles only, rather
   * than being treated as globally accessible.
   */
  async assertFileAccess(
    user: RequestUser,
    file: { projectId: string | null; folderId: string | null },
  ): Promise<void> {
    if (this.isAgencyWide(user)) return;

    const project = await this.resolveFileProject(file);
    if (!project) {
      throw new ForbiddenException('You do not have access to this file.');
    }
    await this.assertProjectAccess(user, project);
  }

  /**
   * Throws unless `user` may access the given task. Same tiers as
   * assertProjectAccess, plus one addition: staff pass if they're the
   * task's assignee even without a project_team_members row — a task can
   * be assigned to someone before/without a formal team-assignment entry,
   * and being the assignee is itself sufficient proof of legitimate access.
   */
  async assertTaskAccess(
    user: RequestUser,
    task: { projectId: string; clientId: string; assigneeId: string | null },
  ): Promise<void> {
    if (this.isAgencyWide(user)) return;

    if (user.userType === UserType.CLIENT) {
      if (user.clientId && user.clientId === task.clientId) return;
      throw new ForbiddenException('You do not have access to this task.');
    }

    if (user.userType === UserType.STAFF) {
      if (task.assigneeId === user.id) return;
      await this.assertProjectAccess(user, {
        id: task.projectId,
        clientId: task.clientId,
      });
      return;
    }

    throw new ForbiddenException('You do not have access to this task.');
  }
}
