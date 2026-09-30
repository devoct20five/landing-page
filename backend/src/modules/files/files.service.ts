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

import { mimeToFileType } from './util/mime-to-file-type';
import { RequestUser } from '../auth/types/authenticated-user.type';
@Injectable()
export class FilesService {
  private readonly storageRoot: string;

  constructor(
    @InjectModel(File) private readonly fileModel: typeof File,
    private readonly config: ConfigService,
  ) {
    this.storageRoot = resolve(
      this.config.get<string>('FILE_STORAGE_ROOT', './storage'),
    );
  }

  async findAll(query: QueryFileDto): Promise<Paginated<File>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: WhereOptions = {};

    if (query.projectId) where['projectId'] = query.projectId;
    if (query.folderId !== undefined)
      where['folderId'] = query.folderId === 0 ? null : query.folderId;
    if (query.fileType) where['fileType'] = query.fileType;
    if (query.search) where['name'] = { [Op.like]: `%${query.search}%` };

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

  async findOne(id: string): Promise<File> {
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

  async create(
    uploaded: Express.Multer.File,
    body: { folderId?: string; projectId?: string },
    requester: RequestUser,
  ): Promise<File> {
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

  async update(id: string, dto: UpdateFileDto): Promise<File> {
    const file = await this.findOne(id);
    await file.update(dto);
    return file;
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
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
