import { PartialType } from '@nestjs/mapped-types';
import { CreateBehindTheWorkDto } from './create-behind-the-work.dto';

export class UpdateBehindTheWorkDto extends PartialType(
  CreateBehindTheWorkDto,
) {}
