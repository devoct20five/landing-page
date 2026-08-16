import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Project Manager' })
  @IsString()
  @MaxLength(60)
  name?: string;

  @ApiProperty({ example: 'project-manager' })
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase letters, numbers and hyphens only',
  })
  slug?: string;

  @ApiPropertyOptional({ example: 'Manages projects, tasks and approvals' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Permission IDs to attach on creation',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
      '7ba7b810-9dad-41d1-80b4-00c04fd430c9',
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  permissionIds?: string[];
}
