import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';
@Controller('files/folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  findChildren(
    @Query('projectId') projectId: string | undefined,
    @Query('parentId') parentId: string | undefined,
  ) {
    // Previously ran these UUID strings through Number(...), which
    // produces NaN for any real id — this endpoint could never have
    // returned correct results. IDs here are UUIDs end to end, matching
    // FoldersService.findChildren's actual (string | null | undefined)
    // signature.
    return this.foldersService.findChildren(
      projectId || undefined,
      parentId === undefined ? undefined : parentId === '' ? null : parentId,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.foldersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFolderDto, @CurrentUser() user: RequestUser) {
    return this.foldersService.create(dto, user);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFolderDto) {
    return this.foldersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.foldersService.remove(id);
  }
}
