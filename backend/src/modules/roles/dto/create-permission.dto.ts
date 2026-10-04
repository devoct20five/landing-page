import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'projects' })
  @IsString()
  @MaxLength(60)
  module!: string;

  @ApiProperty({ example: 'view' })
  @IsString()
  @MaxLength(60)
  action!: string;

  // If omitted, service derives it as `${module}.${action}`
  @ApiPropertyOptional({ example: 'projects.view' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-z0-9]+\.[a-z0-9-]+$/, {
    message: 'slug must look like module.action, e.g. projects.view',
  })
  slug?: string;

  @ApiPropertyOptional({ example: 'View project list and details' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
