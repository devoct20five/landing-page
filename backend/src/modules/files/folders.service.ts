import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import { Folder } from './models/folder.model';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';
import type { RequestUser } from '../auth/types/authenticated-user.type';
@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder) private readonly folderModel: typeof Folder,
  ) {}

  /** Contents of one directory level: pass parentId undefined for a project's root folders. */
  async findChildren(
    projectId: number | undefined,
    parentId: number | null | undefined,
  ): Promise<Folder[]> {
    const where: WhereOptions = { parentId: parentId ?? null };
    if (projectId) where['projectId'] = projectId;
    return this.folderModel.findAll({ where, order: [['name', 'ASC']] });
  }

  async findOne(id: number): Promise<Folder> {
    const folder = await this.folderModel.findByPk(id);
    if (!folder) throw new NotFoundException(`Folder ${id} not found`);
    return folder;
  }

  async create(dto: CreateFolderDto, requester: RequestUser): Promise<Folder> {
    return this.folderModel.create({
      ...dto,
      createdBy: requester.id,
    } as any);
  }

  async update(id: number, dto: UpdateFolderDto): Promise<Folder> {
    const folder = await this.findOne(id);
    await folder.update(dto);
    return folder;
  }

  /** DB has ON DELETE CASCADE on folders.parent_id and files.folder_id (SET NULL) — subfolders
   *  cascade-delete, files inside move to root, matching the schema's declared behavior. */
  async remove(id: number): Promise<void> {
    const folder = await this.findOne(id);
    await folder.destroy();
  }
}
