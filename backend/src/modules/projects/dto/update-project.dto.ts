import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
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

  @IsOptional()
  @IsInt()
  currentWorkServiceId?: number;

  @IsOptional()
  @IsString()
  currentWorkDescription?: string;
}
