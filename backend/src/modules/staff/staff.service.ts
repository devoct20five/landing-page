import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { StaffProfile } from './models/staff-profile.model';
import { User } from '../users/models/user.model';
import {
  CreateStaffProfileDto,
  UpdateStaffProfileDto,
} from './dto/staff-profile.dto';
import { QueryStaffDto } from './dto/query-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(StaffProfile)
    private readonly staffProfileModel: typeof StaffProfile,
  ) {}

  async create(dto: CreateStaffProfileDto): Promise<StaffProfile> {
    const existing = await this.staffProfileModel.findByPk(dto.userId);
    if (existing) {
      throw new ConflictException(
        'A staff profile already exists for this user',
      );
    }
    return this.staffProfileModel.create({ ...dto } as any);
  }

  /** Staff directory (admin 3.6 Team tab): name/role/department + user info. */
  async findAll(query: QueryStaffDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = {};
    if (query.department) where.department = query.department;

    const userWhere: any = {};
    if (query.search) {
      userWhere[Op.or] = [
        { firstName: { [Op.like]: `%${query.search}%` } },
        { lastName: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.staffProfileModel.findAndCountAll({
      where,
      include: [{ model: User, where: userWhere }],
      limit,
      offset: (page - 1) * limit,
      order: [['userId', 'ASC']],
    });

    return { data: rows, total: count, page, limit };
  }

  async findOne(userId: number): Promise<StaffProfile> {
    const profile = await this.staffProfileModel.findByPk(userId, {
      include: [User],
    });
    if (!profile)
      throw new NotFoundException(`Staff profile ${userId} not found`);
    return profile;
  }

  async update(
    userId: number,
    dto: UpdateStaffProfileDto,
  ): Promise<StaffProfile> {
    const profile = await this.findOne(userId);
    await profile.update(dto);
    return profile;
  }

  async remove(userId: number): Promise<void> {
    const profile = await this.findOne(userId);
    await profile.destroy();
  }
}
