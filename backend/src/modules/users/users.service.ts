import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { Role } from '../roles/models/role.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findAll(query: QueryUserDto) {
    const { page, limit, userType, status, roleId, search } = query;

    const where: any = {};
    if (userType) where.userType = userType;
    if (status) where.status = status;
    if (roleId) where.roleId = roleId;
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      include: [Role],
      attributes: { exclude: ['passwordHash'] },
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
      distinct: true,
    });

    return {
      data: rows,
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: [Role],
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  /** Includes passwordHash - internal use only (auth login flow). Never expose via controller. */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email: email.toLowerCase() },
      include: [{ model: Role, include: [] }],
    });
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { uuid },
      include: [Role],
      attributes: { exclude: ['passwordHash'] },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException(
        `A user with email "${dto.email}" already exists`,
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.userModel.create({
      userType: dto.userType,
      roleId: dto.roleId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      initials: this.deriveInitials(dto.firstName, dto.lastName),
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash,
      avatarUrl: dto.avatarUrl,
    });

    return this.findOne(user.id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const clash = await this.userModel.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (clash) {
        throw new ConflictException(
          `A user with email "${dto.email}" already exists`,
        );
      }
    }

    await user.update({
      roleId: dto.roleId ?? user.roleId,
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
      initials:
        dto.firstName || dto.lastName
          ? this.deriveInitials(
              dto.firstName ?? user.firstName,
              dto.lastName ?? user.lastName,
            )
          : user.initials,
      email: dto.email ? dto.email.toLowerCase() : user.email,
      phone: dto.phone ?? user.phone,
      avatarUrl: dto.avatarUrl ?? user.avatarUrl,
      status: dto.status ?? user.status,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    await user.destroy();
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const matches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!matches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await user.save();
  }

  async touchLastLogin(id: string): Promise<void> {
    await this.userModel.update({ lastLoginAt: new Date() }, { where: { id } });
  }

  private deriveInitials(firstName: string, lastName?: string): string {
    const first = firstName?.[0] ?? '';
    const last = lastName?.[0] ?? '';
    return (first + last).toUpperCase().slice(0, 4);
  }
}
