import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SetPasswordDto {
  @ApiProperty({ description: 'One-time token from the emailed link' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  token!: string;

  // Same bounds as ChangePasswordDto (8..72; 72 is bcrypt's input limit).
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(190)
  email!: string;
}
