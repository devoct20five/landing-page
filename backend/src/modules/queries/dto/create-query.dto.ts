import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateQueryDto {
  // Accepted from the request body for staff/admin creating a query on a
  // client's behalf; for a client-user request, QueriesService.create()
  // overwrites this with the requester's own resolved clientId regardless
  // of what's sent here — see the service for why this can't be trusted
  // as-is from a client caller.
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsString()
  @MaxLength(255)
  subject!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}
