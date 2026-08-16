import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
    return this.foldersService.findChildren(
      projectId ? Number(projectId) : undefined,
      parentId === undefined
        ? undefined
        : parentId === ''
          ? null
          : Number(parentId),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foldersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFolderDto, @CurrentUser() user: RequestUser) {
    return this.foldersService.create(dto, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFolderDto) {
    return this.foldersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foldersService.remove(id);
  }
}
