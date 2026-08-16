import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from '../../../common/enums/user-status.enum';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'userType'] as const),
) {
  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
