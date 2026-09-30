import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/role.model';
import { Permission } from './models/permission.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectModel(Permission)
    private readonly permissionModel: typeof Permission,
  ) {}

  findAll() {
    return this.roleModel.findAll({
      include: [Permission],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findByPk(id, { include: [Permission] });
    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }
    return role;
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return this.roleModel.findOne({ where: { slug }, include: [Permission] });
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleModel.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Role slug "${dto.slug}" already exists`);
    }

    const role = await this.roleModel.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    });

    if (dto.permissionIds?.length) {
      await this.setPermissions(role.id, dto.permissionIds);
    }

    return this.findOne(role.id);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (dto.permissionIds) {
      await this.setPermissions(id, dto.permissionIds);
    }

    await role.update({
      name: dto.name ?? role.name,
      description: dto.description ?? role.description,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }
    await role.destroy();
  }

  /** Replaces the full set of permissions attached to a role. */
  async setPermissions(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.findOne(roleId);

    if (permissionIds.length) {
      const found = await this.permissionModel.findAll({
        where: { id: permissionIds },
      });
      if (found.length !== permissionIds.length) {
        throw new BadRequestException('One or more permissionIds do not exist');
      }
    }

    await (role as any).$set('permissions', permissionIds);
    return this.findOne(roleId);
  }

  /** Flat list of permission slugs for a role - used when issuing a JWT. */
  async getPermissionSlugs(roleId: string): Promise<string[]> {
    const role = await this.roleModel.findByPk(roleId, {
      include: [Permission],
    });
    return (role?.permissions ?? []).map((p) => p.slug);
  }
}
