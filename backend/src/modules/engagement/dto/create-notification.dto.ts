import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  // Single recipient
  @IsOptional()
  @IsUUID()
  user_id?: string;

  // Or fan out the same notification to several users at once
  // (e.g. notify every assignee on a project). Provide either
  // user_id or user_ids, not both.
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  user_ids?: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  link_url?: string;
}
