import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './models/permission.model';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission)
    private readonly permissionModel: typeof Permission,
  ) {}

  findAll() {
    return this.permissionModel.findAll({
      order: [
        ['module', 'ASC'],
        ['action', 'ASC'],
      ],
    });
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findByPk(id);
    if (!permission) {
      throw new NotFoundException(`Permission ${id} not found`);
    }
    return permission;
  }

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const slug = dto.slug ?? `${dto.module}.${dto.action}`;

    const existing = await this.permissionModel.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Permission slug "${slug}" already exists`);
    }

    return this.permissionModel.create({
      module: dto.module,
      action: dto.action,
      slug,
      description: dto.description,
    } as any);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await permission.destroy();
  }
}
