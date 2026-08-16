import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateServicePlanDto } from './create-service-plan.dto';

export class UpdateServicePlanDto extends PartialType(
  OmitType(CreateServicePlanDto, ['packages', 'features'] as const),
) {}
