import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../users/models/user.model';
import { CreateJobDto } from './dto/create-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Candidate } from './models/candidate.model';
import { JobPosting } from './models/job-posting.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(JobPosting) private readonly jobModel: typeof JobPosting,
    @InjectModel(Candidate) private readonly candidateModel: typeof Candidate,
  ) {}

  async create(dto: CreateJobDto): Promise<JobPosting> {
    const job = await this.jobModel.create({
      ...dto,
      posted_at: dto.posted_at ?? new Date().toISOString().slice(0, 10),
    } as any);
    return this.findOne(job.id);
  }

  async findAll(filter: JobFilterDto) {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    const where: any = {};

    if (filter.status) where.status = filter.status;
    if (filter.department) where.department = filter.department;
    if (filter.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${filter.search}%` } },
        { location: { [Op.like]: `%${filter.search}%` } },
      ];
    }

    const { rows, count } = await this.jobModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    // Applicant counts per job (surfaced on the job postings list, 3.11)
    const jobIds = rows.map((j) => j.id);
    const counts = jobIds.length
      ? await this.candidateModel.findAll({
          where: { job_id: { [Op.in]: jobIds } },
          attributes: [
            'job_id',
            [this.jobModel.sequelize!.fn('COUNT', '*'), 'count'],
          ],
          group: ['job_id'],
          raw: true,
        })
      : [];
    // job_id (like every id in this schema) is a UUID string. Keying this
    // map by Number(c.job_id) always produced NaN, and job.id below is a
    // string, so applicant_count silently returned 0 for every job — the
    // lookup key could never match. Keyed by the raw string id instead.
    const countMap = new Map<string, number>(
      (counts as any[]).map((c) => [String(c.job_id), Number(c.count)]),
    );

    const data = rows.map((job) => ({
      ...job.toJSON(),
      applicant_count: countMap.get(job.id) ?? 0,
    }));

    return {
      data,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(id: string): Promise<JobPosting> {
    const job = await this.jobModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    });
    if (!job) throw new NotFoundException(`Job posting #${id} not found`);
    return job;
  }

  async update(id: string, dto: UpdateJobDto): Promise<JobPosting> {
    const job = await this.findOne(id);
    await job.update({ ...dto });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await job.destroy();
  }
}
