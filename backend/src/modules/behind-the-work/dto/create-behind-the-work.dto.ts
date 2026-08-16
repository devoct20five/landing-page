import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { BtwContentType } from '../models/behind-the-work.model';

export class CreateBehindTheWorkDto {
  @IsEnum(BtwContentType)
  content_type?: BtwContentType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  thumbnail_url?: string;

  // Direct upload URL, or a YouTube link when content_type = 'youtube'
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  media_url?: string;

  // If omitted, defaults to 'draft' at the DB/service layer.
  // Use the /publish endpoint to move a draft to published.
}
