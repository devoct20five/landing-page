import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserType } from '../../../common/enums/user-type.enum';

export class LoginDto {
  @ApiProperty({ example: 'ada@studio.com' })
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password?: string;

  // Backs the "Client / Staff selector" on the login screen (feature-list 0.).
  // If provided, login fails unless the account's user_type matches, so someone
  // can't log into the Staff portal with a Client account by picking the wrong tab.
  @ApiPropertyOptional({ enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  portal?: UserType;
}
