import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BehindTheWork, BtwStatus } from './models/behind-the-work.model';
import { CreateBehindTheWorkDto } from './dto/create-behind-the-work.dto';
import { UpdateBehindTheWorkDto } from './dto/update-behind-the-work.dto';
import { QueryBehindTheWorkDto } from './dto/query-behind-the-work.dto';
import { User } from '../users/models/user.model';
import { Project } from '../projects/models/project.model';
import { Client } from '../clients/models/client.model';

@Injectable()
export class BehindTheWorkService {
  constructor(
    @InjectModel(BehindTheWork)
    private readonly btwModel: typeof BehindTheWork,
  ) {}

  private readonly includeRelations = [
    { model: Project, attributes: ['id', 'name'] },
    { model: Client, attributes: ['id', 'name', 'short_name', 'logo_url'] },
    {
      model: User,
      as: 'author',
      attributes: ['id', 'first_name', 'last_name', 'avatar_url'],
    },
  ];

  async create(dto: CreateBehindTheWorkDto, authorId: string) {
    if (dto.content_type === 'youtube' && !dto.media_url) {
      throw new BadRequestException(
        'media_url (YouTube link) is required for youtube content',
      );
    }

    return this.btwModel.create({
      ...dto,
      author_id: authorId,
      status: BtwStatus.DRAFT,
    } as any);
  }

  async findAll(query: QueryBehindTheWorkDto) {
    const where: Record<string, any> = {};

    if (query.status) where.status = query.status;
    if (query.content_type) where.content_type = query.content_type;
    if (query.project_id) where.project_id = query.project_id;
    if (query.client_id) where.client_id = query.client_id;
    if (query.search) where.title = { [Op.like]: `%${query.search}%` };

    const { rows, count } = await this.btwModel.findAndCountAll({
      where,
      include: this.includeRelations,
      order: [['created_at', 'DESC']],
      limit: query.limit,
      offset: query.offset,
      distinct: true,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        totalPages: Math.ceil(count / (query.limit ?? 20)),
      },
    };
  }

  // Published-only feed for the public-facing showcase page
  async findPublished(query: QueryBehindTheWorkDto) {
    query.status = BtwStatus.PUBLISHED;
    return this.findAll(query);
  }

  async findOne(id: string) {
    const item = await this.btwModel.findByPk(id, {
      include: this.includeRelations,
    });
    if (!item)
      throw new NotFoundException(`Behind the Work item #${id} not found`);
    return item;
  }

  async update(id: string, dto: UpdateBehindTheWorkDto) {
    const item = await this.findOne(id);
    await item.update(dto);
    return item;
  }

  async setStatus(id: string, status: BtwStatus) {
    const item = await this.findOne(id);
    await item.update({
      status,
      published_at:
        status === BtwStatus.PUBLISHED ? new Date() : item.published_at,
    });
    return item;
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await item.destroy();
    return { id, deleted: true };
  }
}
