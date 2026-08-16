import { IsString, IsUUID } from 'class-validator';

export class CreateCandidateNoteDto {
  @IsUUID()
  user_id?: string;

  @IsString()
  note?: string;
}
