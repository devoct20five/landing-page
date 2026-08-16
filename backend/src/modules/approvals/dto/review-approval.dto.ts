import { IsIn, IsString, ValidateIf } from 'class-validator';
import { ApprovalStatus } from '@/common/enums/index.enum';

export class ReviewApprovalDto {
  @IsIn([
    ApprovalStatus.APPROVED,
    ApprovalStatus.CHANGES_REQUESTED,
    ApprovalStatus.REJECTED,
  ])
  status!: ApprovalStatus;

  @ValidateIf((o) => o.status !== ApprovalStatus.APPROVED)
  @IsString()
  feedback?: string;
}
