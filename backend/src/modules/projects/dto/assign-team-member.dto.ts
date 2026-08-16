import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class AssignTeamMemberDto {
  @IsUUID()
  staffId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  roleOnProject?: string;
}

export class LinkServicesDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  serviceIds?: string[];
}
