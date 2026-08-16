import { IsUUID } from 'class-validator';

export class AssignQueryDto {
  @IsUUID()
  staff_id?: string;
}
