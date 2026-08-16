import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

// slug is intentionally immutable after creation (it's referenced by guards
// and, in seed data, by code) - omit it from updates.
export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['slug'] as const),
) {}
