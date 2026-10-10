import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createHash, randomBytes } from 'crypto';
import { Op, Transaction } from 'sequelize';
import { AuthToken } from './models/auth-token.model';

export type TokenPurpose = 'password_setup' | 'password_reset';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

/**
 * One-time, expiring tokens. Only the SHA-256 is stored, so a database leak
 * does not yield usable links; the raw token exists only in the emailed URL.
 */
@Injectable()
export class AuthTokensService {
  constructor(
    @InjectModel(AuthToken) private readonly tokens: typeof AuthToken,
  ) {}

  async issue(
    userId: string,
    purpose: TokenPurpose,
    ttlMs: number,
  ): Promise<string> {
    // Only the newest link for a purpose is valid.
    await this.tokens.update(
      { usedAt: new Date() },
      { where: { userId, purpose, usedAt: null } },
    );
    const raw = randomBytes(32).toString('base64url');
    await this.tokens.create({
      userId,
      purpose,
      tokenHash: sha256(raw),
      expiresAt: new Date(Date.now() + ttlMs),
    } as any);
    return raw;
  }

  /** Atomically burns the token. Returns the userId, or null if invalid/used/expired. */
  async consume(
    raw: string,
    purposes: TokenPurpose[],
    transaction?: Transaction,
  ): Promise<string | null> {
    if (!raw || raw.length < 20 || raw.length > 200) return null;
    const row = await this.tokens.findOne({
      where: {
        tokenHash: sha256(raw),
        purpose: { [Op.in]: purposes },
        usedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
      transaction,
    });
    if (!row) return null;
    const [affected] = await this.tokens.update(
      { usedAt: new Date() },
      { where: { id: row.id, usedAt: null }, transaction },
    );
    return affected === 1 ? row.userId : null; // lost a race -> already used
  }
}
