import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MaxLength(60)
  slug?: string; // editing, design, 3d, web

  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroHeadline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  heroTag?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  heroImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
