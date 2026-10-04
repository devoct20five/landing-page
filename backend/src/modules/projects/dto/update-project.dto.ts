import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['serviceIds', 'teamMemberIds'] as const),
) {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  attentionReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentWorkTitle?: string;

  // FK to services.id (UUID) — was @IsInt() with a `number` type, another
  // instance of the same numeric-ID assumption fixed elsewhere in this
  // pass (folders, projects/invoices controllers). Never actually
  // validated correctly against this schema's UUID ids.
  @IsOptional()
  @IsUUID()
  currentWorkServiceId?: string;

  @IsOptional()
  @IsString()
  currentWorkDescription?: string;
}
