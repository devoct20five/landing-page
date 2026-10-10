import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, Equals, IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** What is being bought. Note: no price anywhere - the server derives it. */
export class QuoteDto {
  @IsString() @MaxLength(60) serviceSlug!: string;
  @IsString() @MaxLength(60) planSlug!: string;
  @IsOptional() @IsUUID() packId?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(10) @IsString({ each: true }) @MaxLength(40, { each: true }) addonCodes?: string[];
  @IsOptional() @Transform(trim) @IsString() @MaxLength(40) promoCode?: string;
}

export class CreateOrderDto extends QuoteDto {
  @Transform(trim) @IsString() @MinLength(2) @MaxLength(150) name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail() @MaxLength(190) email!: string;

  @IsOptional() @Transform(trim) @Matches(/^[+\d][\d\s\-().]{6,24}$/, { message: 'phone must be a valid phone number' })
  phone?: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(150) company?: string;

  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @Matches(/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/, { message: 'gstin must be a valid 15-character GSTIN' })
  gstin?: string;

  @IsOptional() @IsString() @MaxLength(2000) notes?: string;

  @Type(() => Boolean) @IsBoolean() @Equals(true, { message: 'You must accept the terms to continue' })
  acceptTerms!: boolean;
}

export class VerifyPaymentDto {
  @IsString() @MaxLength(100) providerPaymentId!: string;
  @IsString() @MaxLength(300) signature!: string;
}
