import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Full replacement set of permission IDs for this role',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    ],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  permissionIds!: string[];
}
