import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { ClientsService } from '../clients/clients.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/authenticated-user.type';
import { User } from '../users/models/user.model';
import { UserStatus } from '../../common/enums/user-status.enum';
import { UserType } from '@/common/enums/index.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('This account has been suspended');
    }

    if (dto.portal && dto.portal !== user.userType) {
      throw new ForbiddenException(
        `This account does not have access to the ${dto.portal} portal`,
      );
    }

    await this.usersService.touchLastLogin(user.id);

    const accessToken = await this.signToken(user);

    return {
      accessToken,
      user: user.toSafeJSON(),
    };
  }

  /** Re-issues a token with fresh permissions - call after a role/permission change. */
  async refreshToken(userId: string): Promise<string> {
    const user = await this.usersService.findOne(userId);
    return this.signToken(user);
  }

  private async signToken(user: User): Promise<string> {
    const permissions = await this.rolesService.getPermissionSlugs(user.roleId);
    const role = await this.rolesService.findOne(user.roleId);

    // Every client-scoping check (approvals, tasks, ...) reads
    // requester.clientId, so a client-portal user needs it embedded here —
    // the guards never hit the database, the same reason permissions are
    // flattened into the token instead of looked up per request.
    const clientId =
      user.userType === UserType.CLIENT
        ? await this.clientsService.findClientIdForUser(user.id)
        : undefined;

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
      roleId: user.roleId,
      roleSlug: role.slug,
      clientId: clientId ?? undefined,
      permissions,
    };

    return this.jwtService.signAsync(payload);
  }
}
