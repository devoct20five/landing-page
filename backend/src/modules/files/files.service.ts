import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions, Op } from 'sequelize';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { File } from './models/file.model';
import { User } from '../users/models/user.model';
import { QueryFileDto } from './dto/query-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { paginate, Paginated } from '@/common/dto/pagination-query.dto';
import { UserType } from '@/common/enums/user-type.enum';
import { AccessControlService } from '@/common/access-control/access-control.service';

import { mimeToFileType } from './util/mime-to-file-type';
import type { RequestUser } from '../auth/types/authenticated-user.type';
@Injectable()
export class FilesService {
  private readonly storageRoot: string;

  constructor(
    @InjectModel(File) private readonly fileModel: typeof File,
    private readonly config: ConfigService,
    private readonly accessControl: AccessControlService,
  ) {
    this.storageRoot = resolve(
      this.config.get<string>('FILE_STORAGE_ROOT', './storage'),
    );
  }

  /**
   * docs/00_CURRENT_STATE_AUDIT.md §3/§38: previously took whatever
   * projectId the caller passed at face value. Agency-wide roles can list
   * by any projectId they ask for; a client is restricted to their own
   * projects (so passing a projectId they don't own is safe — the where
   * clause below just returns nothing rather than trusting it); staff
   * without agency-wide access are restricted to their assigned projects.
   */
  async findAll(query: QueryFileDto, user: RequestUser): Promise<Paginated<File>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: WhereOptions = {};

    if (query.projectId) where['projectId'] = query.projectId;
    // NOTE: this used to compare query.folderId to the number 0 to mean
    // "root/no folder" — folderId is a UUID string here, so that
    // comparison could never be true and was dead code (also a TS
    // error: string vs number have no overlap). There's no established
    // convention yet for "give me root-level files only" (folderId IS
    // NULL) — that needs a deliberate decision (e.g. a `folderId=root`
    // sentinel) rather than a guessed fix, so for now this only filters
    // by an actual provided folder id.
    if (query.folderId) where['folderId'] = query.folderId;
    if (query.fileType) where['fileType'] = query.fileType;
    if (query.search) where['name'] = { [Op.like]: `%${query.search}%` };

    if (user.userType === UserType.CLIENT) {
      // Files aren't directly tagged with a clientId — they hang off a
      // project. A client with no resolvable projectId filter would
      // otherwise see every file in the system, so require one and force
      // it through the same project-ownership check a single-file fetch
      // uses, rather than trusting query.projectId outright.
      if (!query.projectId) {
        return paginate([], 0, page, limit);
      }
      await this.accessControl.assertProjectAccess(user, {
        id: query.projectId,
        clientId: user.clientId ?? '',
      });
    } else if (user.roleSlug === 'staff') {
      const scope = await this.accessControl.scopeProjectIdWhereForStaff(user);
      Object.assign(where, scope);
    }

    const { rows, count } = await this.fileModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return paginate(rows, count, page, limit);
  }

  /** Fetches a file with no access check — internal use only. */
  private async findOneUnscoped(id: string): Promise<File> {
    const file = await this.fileModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
        },
      ],
    });
    if (!file) throw new NotFoundException(`File ${id} not found`);
    return file;
  }

  async findOne(id: string, user: RequestUser): Promise<File> {
    const file = await this.findOneUnscoped(id);
    await this.accessControl.assertFileAccess(user, file);
    return file;
  }

  async create(
    uploaded: Express.Multer.File,
    body: { folderId?: string; projectId?: string },
    requester: RequestUser,
  ): Promise<File> {
    if (body.projectId) {
      await this.accessControl.assertProjectAccess(requester, {
        id: body.projectId,
        clientId: requester.clientId ?? '',
      });
    }
    return this.fileModel.create({
      folderId: body.folderId ?? null,
      projectId: body.projectId ?? null,
      name: uploaded.originalname,
      fileType: mimeToFileType(uploaded.mimetype),
      mimeType: uploaded.mimetype,
      sizeBytes: uploaded.size,
      storageUrl: uploaded.path,
      version: '01',
      uploadedBy: requester.id,
    } as any);
  }

  async update(id: string, dto: UpdateFileDto, user: RequestUser): Promise<File> {
    const file = await this.findOneUnscoped(id);
    await this.accessControl.assertFileAccess(user, file);
    await file.update(dto);
    return file;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const file = await this.findOneUnscoped(id);
    await this.accessControl.assertFileAccess(user, file);
    await file.destroy();
    await fs.unlink(file.storageUrl).catch(() => undefined); // best-effort disk cleanup
  }

  /** Absolute path used by the controller to stream the file back for download. */
  resolveStoragePath(relativeOrAbsolutePath: string): string {
    return resolve(relativeOrAbsolutePath);
  }

  get uploadDestination(): string {
    return this.storageRoot;
  }

  async ensureStorageRoot(): Promise<void> {
    await fs.mkdir(this.storageRoot, { recursive: true });
  }
}
