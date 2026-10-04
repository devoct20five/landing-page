import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Client } from './models/client.model';
import { ClientContact } from './models/client-contact.model';
import { User } from '../users/models/user.model';
import { Project } from '../projects/models/project.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  CreateClientContactDto,
  UpdateClientContactDto,
} from './dto/client-contact.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { ProjectStatus } from '@/common/enums/index.enum';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectModel(ClientContact)
    private readonly clientContactModel: typeof ClientContact,
  ) {}

  // ---------------------------------------------------------------------
  // Client CRUD (admin: 3.2, also backs client public profile / settings)
  // ---------------------------------------------------------------------

  async create(dto: CreateClientDto, createdBy: string): Promise<Client> {
    return this.clientModel.create({ ...dto, createdBy } as any);
  }

  async findAll(query: QueryClientDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { shortName: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.clientModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['name', 'ASC']],
    });

    return { data: rows, total: count, page, limit };
  }

  /** Client detail page: full project history for a single client (3.2). */
  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findByPk(id, {
      include: [{ model: ClientContact, include: [User] }, { model: Project }],
    });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    await client.update(dto);
    return client;
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await client.destroy();
  }

  /** Aggregate stats row for the admin client list (3.2). */
  async statsFor(id: string) {
    const client = await this.findOne(id);
    const projects = client.projects ?? [];

    return {
      clientId: id,
      activeProjects: projects.filter((p) =>
        [ProjectStatus.IN_PROGRESS, ProjectStatus.CLIENT_REVIEW].includes(
          p.status,
        ),
      ).length,
      completedProjects: projects.filter(
        (p) => p.status === ProjectStatus.COMPLETED,
      ).length,
      atRiskProjects: projects.filter((p) => p.status === ProjectStatus.BLOCKED)
        .length,
      averageProgress: projects.length
        ? Math.round(
            projects.reduce((sum, p) => sum + p.progressPercent, 0) /
              projects.length,
          )
        : 0,
    };
  }

  // ---------------------------------------------------------------------
  // Client contacts (logins belonging to a client company)
  // ---------------------------------------------------------------------

  async addContact(
    clientId: string,
    dto: CreateClientContactDto,
  ): Promise<ClientContact> {
    await this.findOne(clientId); // 404s if client missing

    const existing = await this.clientContactModel.findOne({
      where: { clientId, userId: dto.userId },
    });
    if (existing) {
      throw new ConflictException(
        'This user is already a contact for this client',
      );
    }

    if (dto.isPrimary) {
      await this.clientContactModel.update(
        { isPrimary: false },
        { where: { clientId } },
      );
    }

    return this.clientContactModel.create({ ...dto, clientId } as any);
  }

  async listContacts(clientId: string): Promise<ClientContact[]> {
    await this.findOne(clientId);
    return this.clientContactModel.findAll({
      where: { clientId },
      include: [User],
    });
  }

  async updateContact(
    clientId: string,
    contactId: string,
    dto: UpdateClientContactDto,
  ): Promise<ClientContact> {
    const contact = await this.clientContactModel.findOne({
      where: { id: contactId, clientId },
    });
    if (!contact) throw new NotFoundException('Client contact not found');

    if (dto.isPrimary) {
      await this.clientContactModel.update(
        { isPrimary: false },
        { where: { clientId } },
      );
    }

    await contact.update(dto);
    return contact;
  }

  async removeContact(clientId: string, contactId: string): Promise<void> {
    const contact = await this.clientContactModel.findOne({
      where: { id: contactId, clientId },
    });
    if (!contact) throw new NotFoundException('Client contact not found');
    await contact.destroy();
  }

  /**
   * Resolves which Client a client-portal user belongs to, via their
   * ClientContact row. Used at login (see AuthService.signToken) to embed
   * clientId in the JWT — every client-scoping check in the app
   * (approvals, tasks, ...) reads requester.clientId from that claim, so a
   * client user with no ClientContact row will not be scoped to anything.
   */
  async findClientIdForUser(userId: string): Promise<string | null> {
    const contact = await this.clientContactModel.findOne({
      where: { userId },
      attributes: ['clientId'],
    });
    return contact?.clientId ?? null;
  }
}
