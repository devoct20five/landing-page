import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateApprovalDto {
  @IsUUID()
  projectId?: string;

  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  deliverableId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  version?: string;

  @IsOptional()
  @IsUUID()
  fileId?: string;
}
