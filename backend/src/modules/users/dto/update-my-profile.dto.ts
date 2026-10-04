import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

/**
 * Fields a user may change about *themselves* via PATCH /users/me.
 *
 * Deliberately NOT based on UpdateUserDto/PartialType(CreateUserDto):
 * that DTO includes `roleId` and `status`, and the controller's
 * `updateMe` route has no permission check (correctly — it's meant to be
 * usable by any authenticated user for their own basic profile fields).
 * Reusing the admin DTO there would let any logged-in user set their own
 * `roleId` to an admin role's id and self-escalate, or flip their own
 * `status` back to active after being suspended. See
 * docs/00_CURRENT_STATE_AUDIT.md — role/permission changes must only
 * happen through the permission-gated admin routes.
 */
export class UpdateMyProfileDto {
  @ApiPropertyOptional({ example: 'Ada' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Lovelace' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ example: 'ada@studio.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(190)
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;
}
