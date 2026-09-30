import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../users/models/user.model';
import { CandidateFilterDto } from './dto/candidate-filter.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CreateCandidateNoteDto } from './dto/create-candidate-note.dto';
import { UpdateCandidateStageDto } from './dto/update-candidate-stage.dto';
import { Candidate } from './models/candidate.model';
import { CandidateNote } from './models/candidate-note.model';
import { JobPosting } from './models/job-posting.model';

const INCLUDE = [
  { model: JobPosting, attributes: ['id', 'title', 'department'] },
  {
    model: CandidateNote,
    as: 'notes',
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'first_name', 'last_name'],
      },
    ],
  },
];

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate) private readonly candidateModel: typeof Candidate,
    @InjectModel(CandidateNote)
    private readonly noteModel: typeof CandidateNote,
    @InjectModel(JobPosting) private readonly jobModel: typeof JobPosting,
  ) {}

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    const job = await this.jobModel.findByPk(dto.job_id);
    if (!job)
      throw new NotFoundException(`Job posting #${dto.job_id} not found`);

    const candidate = await this.candidateModel.create({ ...dto } as any);
    return this.findOne(candidate.id);
  }

  async findAll(filter: CandidateFilterDto) {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    const where: any = {};

    if (filter.job_id) where.job_id = filter.job_id;
    if (filter.stage) where.stage = filter.stage;
    if (filter.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter.search}%` } },
        { email: { [Op.like]: `%${filter.search}%` } },
      ];
    }

    const { rows, count } = await this.candidateModel.findAndCountAll({
      where,
      include: [
        { model: JobPosting, attributes: ['id', 'title', 'department'] },
      ],
      order: [['applied_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  /** Pipeline view grouped by stage — for the candidate pipeline board (3.11). */
  async pipeline(jobId?: string) {
    const where: any = jobId ? { job_id: jobId } : {};
    const candidates = await this.candidateModel.findAll({
      where,
      include: [{ model: JobPosting, attributes: ['id', 'title'] }],
      order: [['applied_at', 'DESC']],
    });

    const stages = [
      'new',
      'review',
      'shortlisted',
      'interview',
      'hired',
      'rejected',
    ] as const;
    const board: Record<string, Candidate[]> = Object.fromEntries(
      stages.map((s) => [s, []]),
    );
    for (const c of candidates) board[c.stage].push(c);
    return board;
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findByPk(id, {
      include: INCLUDE,
    });
    if (!candidate) throw new NotFoundException(`Candidate #${id} not found`);
    return candidate;
  }

  async updateStage(
    id: string,
    dto: UpdateCandidateStageDto,
  ): Promise<Candidate> {
    const candidate = await this.findOne(id);
    await candidate.update({ stage: dto.stage });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const candidate = await this.findOne(id);
    await candidate.destroy();
  }

  async addNote(
    candidateId: string,
    dto: CreateCandidateNoteDto,
  ): Promise<CandidateNote> {
    await this.findOne(candidateId); // 404 guard
    const note = await this.noteModel.create({
      candidate_id: candidateId,
      ...dto,
    } as any);
    const created = await this.noteModel.findByPk(note.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    });
    if (!created) throw new NotFoundException(`Note #${note.id} not found`);
    return created;
  }

  async listNotes(candidateId: string): Promise<CandidateNote[]> {
    await this.findOne(candidateId);
    return this.noteModel.findAll({
      where: { candidate_id: candidateId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }
}
