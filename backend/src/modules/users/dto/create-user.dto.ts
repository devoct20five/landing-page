import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserType } from '../../../common/enums/user-type.enum';

export class CreateUserDto {
  @ApiProperty({ enum: UserType, example: UserType.STAFF })
  @IsEnum(UserType)
  userType!: UserType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'FK to roles.id',
  })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ example: 'Ada' })
  @IsString()
  @MaxLength(80)
  firstName!: string;

  @ApiPropertyOptional({ example: 'Lovelace' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiProperty({ example: 'ada@studio.com' })
  @IsEmail()
  @MaxLength(190)
  email!: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'Str0ngP@ssword!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatars/1.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;
}
